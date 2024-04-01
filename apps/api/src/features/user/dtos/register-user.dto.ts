import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GENDER } from '../user.schema';

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public fullname: string;

  @IsEmail()
  @IsNotEmpty()
  public mail: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsPhoneNumber()
  public phoneNumber: number;

  @IsEnum(GENDER)
  public gender: number;
}
