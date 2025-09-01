import { IsUUID } from 'class-validator';
/**
 *
 */
export class IdDto {
  @IsUUID()
  readonly id: number;
}
