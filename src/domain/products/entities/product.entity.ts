import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegistryDate } from '../../../common/dtos/embedded/registry-date.embedded';
import { Category } from '../../categories/entities/category.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price: number;

  @Column(() => RegistryDate, { prefix: false })
  registrationDates: RegistryDate;

  @ManyToMany(() => Category, (Category) => Category.products)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => OrderItem, (item) => item.product)
  items: OrderItem[];
}
