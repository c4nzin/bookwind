import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { isFieldTaken } from 'src/core/decorators';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @isFieldTaken('username')
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
