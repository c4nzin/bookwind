import { Controller, Get, Param } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { User } from 'src/core/decorators/user.decorator';
import { User as test, UserDocument } from '../entities/user.schema';
import { Message } from 'src/core/decorators/message.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get('me')
  @Message('Sucessfully fetched the logged user')
  public loggedUser(@User() user: test) {
    return user;
  }

  @Get(':username')
  public async getByUsername(
    @Param('username') username: string,
  ): Promise<UserDocument[] | null> {
    return this.userRepository.findByUsername(username);
  }
}
