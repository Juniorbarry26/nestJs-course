import { Exclude } from 'class-transformer';
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
  @Exclude()
  @Column()
  password: string;

  @Column(() => RegistryDate, { prefix: false })
  registryDate: RegistryDate;

  get isDeleted() {
    return this.registryDate.deletedAt;
  }
  @OneToMany(() => Order, (order) => order.customer, {
    cascade: ['soft-remove', 'recover'],
  })
  orders: Order[];
}
