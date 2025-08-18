import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegistryDate } from '../../../common/dtos/embedded/registry-date.embedded';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column(() => RegistryDate, { prefix: false })
  registryDates: RegistryDate;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
