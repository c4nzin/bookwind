import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UserSchema } from '@features/user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserSchema> {
    return this.authService.registerUser(registerUserDto);
  }
}
