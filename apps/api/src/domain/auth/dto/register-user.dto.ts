import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { isFieldUnique } from '../../../core/decorators';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @isFieldUnique('username')
  public username: string;

  @ApiProperty()
  @IsEmail()
  public mail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public fullname: string;
}
