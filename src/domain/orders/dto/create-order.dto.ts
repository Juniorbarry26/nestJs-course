import { Type } from 'class-transformer';
import { ArrayNotEmpty, ArrayUnique, ValidateNested } from 'class-validator';
import { IdDto } from '../../../common/dtos/id.dto';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  readonly customer: IdDto;

  @ArrayNotEmpty()
  @ArrayUnique()
  @ValidateNested()
  @Type(() => OrderItemDto)
  readonly items: OrderItemDto[];
}
