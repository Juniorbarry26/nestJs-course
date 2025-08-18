import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegistryDate } from '../../../common/dtos/embedded/registry-date.embedded';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ unique: true })
  phone: string;
  @Column()
  password: string;

  @Column(() => RegistryDate, { prefix: false })
  registryDate: RegistryDate;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
