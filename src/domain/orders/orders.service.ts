import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../querying/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../querying/util/querying.constant';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemDto } from './dto/order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    const itemsWithPrice = await Promise.all(
      items.map((item) => this.createOrderItemWithPrice(item)),
    );
    const order = this.orderRepository.create({
      ...createOrderDto,
      items: itemsWithPrice,
    });
    return this.orderRepository.save(order);
  }

  findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.orderRepository.find({
      skip: page,
      take: limit ?? DEFAULT_PAGE_SIZE.ORDERS,
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        items: { product: true },
        payment: true,
      },
    });
    if (!order) throw new NotFoundException('order not found.');
    return order;
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this.orderRepository.remove(order);
  }

  private async createOrderItemWithPrice(orderItemDto: OrderItemDto) {
    const { id } = orderItemDto.product;

    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { price } = product;

    const orderItem = this.orderItemRepository.create({
      ...orderItemDto,
      price,
    });

    return orderItem;
  }
}
