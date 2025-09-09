import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class RegisterDto {

  @ApiProperty({ required: false, description: 'User email address' })
  @IsOptional()
  @IsEmail()
  readonly email: string;

  
  readonly password: string;

  @ApiProperty({ required: false, description: 'Username' })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  readonly name: string;

  @ApiProperty({ description: 'First name' })
  @IsString()
  @Length(1, 100)
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @Length(1, 100)
  lastName: string;

  @ApiProperty({ description: 'Phone number' })
  @IsPhoneNumber()
  readonly phone: string;

  @ApiProperty({ description: 'Date of birth' })
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;
}