import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegistryDate } from '../../../common/dtos/embedded/registry-date.embedded';
import { Order } from '../../orders/entities/order.entity';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;
  @Column({ unique: true })
  phone: string;
  @Exclude()
  @Column()
  password: string;

  @Column({ default: 'user' })
  role: UserRole;

  @Column({ default: 'active' })
  status: UserStatus;

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
