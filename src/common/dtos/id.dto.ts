import { IsCardinal } from '../decorator/validators/is-cardinal.decorator';
/**
 *
 */
export class IdDto {
  @IsCardinal({})
  readonly id: number;
}
