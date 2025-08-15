import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class RegistryDate {
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
