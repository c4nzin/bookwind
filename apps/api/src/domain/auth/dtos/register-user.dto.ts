import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @IsNotEmpty()
  public username: string;

  @IsEmail()
  @IsNotEmpty()
  public mail: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
