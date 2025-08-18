import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { productsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [productsService],
})
export class ProductsModule {}
