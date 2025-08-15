import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RegistryDate } from '../../../common/dtos/embedded/registry-date.embedded';

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
}
