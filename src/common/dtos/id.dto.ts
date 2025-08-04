import { IsCardinal } from '../decorator/is-cardinal.decorator';
/**
 *
 */
export class IdDto {
  @IsCardinal({})
  readonly id: number;
}
