import { IsOptional } from 'class-validator';
import { IsCardinal } from '../../common/decorator/validators/is-cardinal.decorator';

export class PaginationDto {
  @IsOptional()
  @IsCardinal({})
  readonly limit?: number;

  @IsOptional()
  @IsCardinal({})
  readonly offset?: number;
}
