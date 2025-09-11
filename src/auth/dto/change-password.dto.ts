import { IsString, Matches } from "class-validator";

export class ChangePasswordDto {

  @IsString()
  readonly oldPassword: string;
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/, {
    message: 'Password too weak. Must contain uppercase, number, and special char',
  })
  readonly newPassword: string;
  @IsString()
  readonly confirmPassword: string;
}