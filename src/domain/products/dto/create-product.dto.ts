import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Length,
  ValidateNested,
} from 'class-validator';
import { IdDto } from '../../../common/dtos/id.dto';

export class CreateProductDto {
  @Length(2, 50)
  readonly name: string;

  @IsOptional()
  @Length(1, 500)
  readonly description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  readonly price: number;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => IdDto)
  readonly categories: IdDto[];
}
