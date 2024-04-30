import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorAuthenticationDto {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public fullname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public sub: string;
}
