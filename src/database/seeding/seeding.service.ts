import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from '../../domain/categories/entities/category.entity';
import { OrderItem } from '../../domain/orders/entities/order-item.entity';
import { Order } from '../../domain/orders/entities/order.entity';
import { OrderStatus } from '../../domain/orders/enums/order-status.enums';
import { Payment } from '../../domain/payments/entities/payment.entity';
import { Product } from '../../domain/products/entities/product.entity';
import { User } from '../../domain/users/entities/user.entity';

@Injectable()
export class SeedingService {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepository = queryRunner.manager.getRepository(User);
      const categoryRepository = queryRunner.manager.getRepository(Category);
      const productRepository = queryRunner.manager.getRepository(Product);
      const orderRepository = queryRunner.manager.getRepository(Order);
      const orderItemRepository = queryRunner.manager.getRepository(OrderItem);
      const paymentRepository = queryRunner.manager.getRepository(Payment);

      // 🧹 Clear old data
      await paymentRepository.clear();
      await orderItemRepository.clear();
      await orderRepository.clear();
      await productRepository.clear();
      await categoryRepository.clear();
      await userRepository.clear();

      // 📂 Categories
      const categories = await categoryRepository.save([
        categoryRepository.create({ name: 'Electronics' }),
        categoryRepository.create({ name: 'Books' }),
        categoryRepository.create({ name: 'Fashion' }),
        categoryRepository.create({ name: 'Groceries' }),
        categoryRepository.create({ name: 'Home & Kitchen' }),
        categoryRepository.create({ name: 'Sports' }),
      ]);

      // 📦 Products (2 per category)
      const products = await productRepository.save([
        // Electronics
        productRepository.create({
          name: 'Smartphone X',
          description: 'Latest gen smartphone',
          price: 899.99,
          categories: [categories[0]],
        }),
        productRepository.create({
          name: 'Laptop Pro 15"',
          description: 'Powerful laptop for work',
          price: 1499.0,
          categories: [categories[0]],
        }),

        // Books
        productRepository.create({
          name: 'Book of Cain',
          description: 'Ancient writings of a scholar',
          price: 25.5,
          categories: [categories[1]],
        }),
        productRepository.create({
          name: 'NestJS in Action',
          description: 'Practical guide for backend devs',
          price: 40.0,
          categories: [categories[1]],
        }),

        // Fashion
        productRepository.create({
          name: 'Classic T-Shirt',
          description: '100% cotton, unisex',
          price: 15.99,
          categories: [categories[2]],
        }),
        productRepository.create({
          name: 'Sneakers Runner',
          description: 'Comfortable running shoes',
          price: 55.0,
          categories: [categories[2]],
        }),

        // Groceries
        productRepository.create({
          name: 'Organic Apples',
          description: 'Freshly picked apples',
          price: 5.99,
          categories: [categories[3]],
        }),
        productRepository.create({
          name: 'Milk 1L',
          description: 'Fresh cow milk',
          price: 2.5,
          categories: [categories[3]],
        }),

        // Home & Kitchen
        productRepository.create({
          name: 'Blender 3000',
          description: 'High-speed kitchen blender',
          price: 70.0,
          categories: [categories[4]],
        }),
        productRepository.create({
          name: 'Non-stick Pan',
          description: 'Durable cooking pan',
          price: 25.0,
          categories: [categories[4]],
        }),

        // Sports
        productRepository.create({
          name: 'Football',
          description: 'Standard size 5 ball',
          price: 18.0,
          categories: [categories[5]],
        }),
        productRepository.create({
          name: 'Yoga Mat',
          description: 'Comfortable and durable',
          price: 22.0,
          categories: [categories[5]],
        }),
      ]);

      // 👤 Users
      const users = await userRepository.save([
        userRepository.create({
          name: 'Admin User',
          email: 'admin@example.com',
          phone: '200000001',
          password: 'Admin@123',
        }),
        userRepository.create({
          name: 'Alsainey Barry',
          email: 'alsainey@gmail.com',
          phone: '300000001',
          password: 'Avond778@',
        }),
        userRepository.create({
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '300000002',
          password: 'Password123',
        }),
        userRepository.create({
          name: 'John Smith',
          email: 'john@example.com',
          phone: '300000003',
          password: 'Secret123',
        }),
        userRepository.create({
          name: 'Fatou Jallow',
          email: 'fatou@example.com',
          phone: '300000004',
          password: 'FatouPass',
        }),
      ]);

      // 🛒 Orders (each user gets 1 order with random items)
      const orders: Order[] = [];
      for (let i = 1; i < users.length; i++) {
        // skip admin
        const orderItems = [
          orderItemRepository.create({
            product: products[Math.floor(Math.random() * products.length)],
            quantity: 1 + Math.floor(Math.random() * 3),
            price: products[0].price,
          }),
          orderItemRepository.create({
            product: products[Math.floor(Math.random() * products.length)],
            quantity: 1 + Math.floor(Math.random() * 2),
            price: products[1].price,
          }),
        ];

        await orderItemRepository.save(orderItems);

        const order = orderRepository.create({
          customer: users[i],
          items: orderItems,
          status: OrderStatus.AWAITING_PAYMENT,
        });

        await orderRepository.save(order);
        orders.push(order);
      }

      await queryRunner.commitTransaction();
      console.log('✅ Database seeded with multiple items!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Seeding failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
