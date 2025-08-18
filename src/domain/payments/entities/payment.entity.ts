import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegistryDate } from '../../../common/dtos/embedded/registry-date.embedded';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Column(() => RegistryDate, { prefix: true })
  registryDates: RegistryDate;

  @OneToOne(() => Order, (order) => order.payment, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Order;
}
