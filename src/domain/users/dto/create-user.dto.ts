/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly email: string;
  @IsString()
  readonly phone: string;
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password too weak. Must contain uppercase, lowercase, number, special char, and be at least 8 characters.',
    },
  )
  readonly password: string;
}
