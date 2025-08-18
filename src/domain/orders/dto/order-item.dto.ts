import { IdDto } from '../../../common/dtos/id.dto';

export class OrderItemDto {
  readonly product: IdDto;
  readonly quantity: number;
}
