import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryingModule } from '../../querying/querying.module';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), QueryingModule], // <-- THIS IS IMPORTANT
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
