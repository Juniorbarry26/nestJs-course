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
      const userRepo = queryRunner.manager.getRepository(User);
      const categoryRepo = queryRunner.manager.getRepository(Category);
      const productRepo = queryRunner.manager.getRepository(Product);
      const orderRepo = queryRunner.manager.getRepository(Order);
      const orderItemRepo = queryRunner.manager.getRepository(OrderItem);
      const paymentRepo = queryRunner.manager.getRepository(Payment);

      // 🧹 Clear old data safely
      await queryRunner.query(`TRUNCATE TABLE "payment" CASCADE`);
      await queryRunner.query(`TRUNCATE TABLE "order_item" CASCADE`);
      await queryRunner.query(`TRUNCATE TABLE "order" CASCADE`);
      await queryRunner.query(`TRUNCATE TABLE "product" CASCADE`);
      await queryRunner.query(`TRUNCATE TABLE "category" CASCADE`);
      await queryRunner.query(`TRUNCATE TABLE "user" CASCADE`);

      // 📂 Categories
      const categories = await categoryRepo.save([
        categoryRepo.create({ name: 'Electronics' }),
        categoryRepo.create({ name: 'Books' }),
        categoryRepo.create({ name: 'Fashion' }),
        categoryRepo.create({ name: 'Groceries' }),
        categoryRepo.create({ name: 'Home & Kitchen' }),
        categoryRepo.create({ name: 'Sports' }),
      ]);

      //  Products (2 per category)
      const products = await productRepo.save([
        // Existing products...
        productRepo.create({
          name: 'Smartphone X',
          description: 'Latest gen smartphone',
          price: 899.99,
          categories: [categories[0]],
        }),
        productRepo.create({
          name: 'Laptop Pro 15"',
          description: 'Powerful laptop for work',
          price: 1499.0,
          categories: [categories[0]],
        }),
        productRepo.create({
          name: 'Book of Cain',
          description: 'Ancient writings of a scholar',
          price: 25.5,
          categories: [categories[1]],
        }),
        productRepo.create({
          name: 'NestJS in Action',
          description: 'Practical guide for backend devs',
          price: 40.0,
          categories: [categories[1]],
        }),
        productRepo.create({
          name: 'Classic T-Shirt',
          description: '100% cotton, unisex',
          price: 15.99,
          categories: [categories[2]],
        }),
        productRepo.create({
          name: 'Sneakers Runner',
          description: 'Comfortable running shoes',
          price: 55.0,
          categories: [categories[2]],
        }),
        productRepo.create({
          name: 'Organic Apples',
          description: 'Freshly picked apples',
          price: 5.99,
          categories: [categories[3]],
        }),
        productRepo.create({
          name: 'Milk 1L',
          description: 'Fresh cow milk',
          price: 2.5,
          categories: [categories[3]],
        }),
        productRepo.create({
          name: 'Blender 3000',
          description: 'High-speed kitchen blender',
          price: 70.0,
          categories: [categories[4]],
        }),
        productRepo.create({
          name: 'Non-stick Pan',
          description: 'Durable cooking pan',
          price: 25.0,
          categories: [categories[4]],
        }),
        productRepo.create({
          name: 'Football',
          description: 'Standard size 5 ball',
          price: 18.0,
          categories: [categories[5]],
        }),
        productRepo.create({
          name: 'Yoga Mat',
          description: 'Comfortable and durable',
          price: 22.0,
          categories: [categories[5]],
        }),

        // New additions...
        productRepo.create({
          name: 'Wireless Earbuds Pro',
          description: 'Noise-cancelling earbuds with 24-hour battery life',
          price: 199.99,
          categories: [categories[0]],
        }),
        productRepo.create({
          name: 'Mastering NestJS',
          description: 'Comprehensive guide for building scalable backend apps',
          price: 39.99,
          categories: [categories[1]],
        }),
        productRepo.create({
          name: 'The Pragmatic Programmer',
          description: 'Classic book on software craftsmanship and mindset',
          price: 29.5,
          categories: [categories[1]],
        }),
        productRepo.create({
          name: 'Slim Fit Denim Jeans',
          description: 'Stylish and comfortable jeans for everyday wear',
          price: 49.99,
          categories: [categories[2]],
        }),
        productRepo.create({
          name: 'Leather Wristwatch',
          description: 'Elegant analog watch with genuine leather strap',
          price: 120.0,
          categories: [categories[2]],
        }),
        productRepo.create({
          name: 'Organic Bananas',
          description: 'Fresh bananas grown without pesticides',
          price: 3.99,
          categories: [categories[3]],
        }),
        productRepo.create({
          name: 'Brown Rice 1kg',
          description: 'Whole grain rice packed with nutrients',
          price: 4.5,
          categories: [categories[3]],
        }),
        productRepo.create({
          name: 'Electric Kettle',
          description: '1.7L stainless steel kettle with auto shut-off',
          price: 35.0,
          categories: [categories[4]],
        }),
        productRepo.create({
          name: 'Resistance Bands Set',
          description: 'Multi-level bands for strength training and mobility',
          price: 25.0,
          categories: [categories[5]],
        }),
      ]);

      //  Users
      const users = await userRepo.save([
        userRepo.create({
          name: 'Admin User',
          email: 'admin@example.com',
          phone: '200000001',
          password: 'Admin@123',
        }),
        userRepo.create({
          name: 'Alsainey Barry',
          email: 'alsainey@gmail.com',
          phone: '300000001',
          password: 'Avond778@',
        }),
        userRepo.create({
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '300000002',
          password: 'Password123',
        }),
        userRepo.create({
          name: 'John Smith',
          email: 'john@example.com',
          phone: '300000003',
          password: 'Secret123',
        }),
        userRepo.create({
          name: 'Fatou Jallow',
          email: 'fatou@example.com',
          phone: '300000004',
          password: 'FatouPass',
        }),
        userRepo.create({
          name: 'Mohamed Sillah',
          email: 'muha@gmail.com',
          phone: '300000005',
          password: 'Mohamed123',
        }),
        userRepo.create({
          name: 'Aisha Ceesay',
          email: 'taisha@gmail.com',
          phone: '300000006',
          password: 'Aisha123',
        }),
        userRepo.create({
          name: 'Kebba Jobe',
          email: 'kebs@gmail.com',
          phone: '300000007',
          password: 'Kebba123',
        }),
      ]);

      //  Orders (each user gets 1 order with random items)
      for (let i = 1; i < users.length; i++) {
        const orderItems = [
          orderItemRepo.create({
            product: products[Math.floor(Math.random() * products.length)],
            quantity: 1 + Math.floor(Math.random() * 3),
            price: products[0].price,
          }),
          orderItemRepo.create({
            product: products[Math.floor(Math.random() * products.length)],
            quantity: 1 + Math.floor(Math.random() * 2),
            price: products[1].price,
          }),
        ];

        const order = orderRepo.create({
          customer: users[i],
          items: orderItems, // attach items BEFORE saving
          status: OrderStatus.AWAITING_PAYMENT,
        });

        await orderRepo.save(order); // cascade saves the items automatically
      }

      await queryRunner.commitTransaction();
      console.log('✅ Database seeded successfully!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Seeding failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
