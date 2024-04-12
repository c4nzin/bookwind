import { Controller, Get } from '@nestjs/common';
import { AuthService } from 'src/domain/auth/auth.service';
import { UserRepository } from '../repositories';
import { User } from 'src/core/decorators/user.decorator';
import { UserModule } from '../user.module';
import { User as test, UserSchema } from '../entities/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get('me')
  public loggedUser(@User() user: test) {
    return user;
  }
}
