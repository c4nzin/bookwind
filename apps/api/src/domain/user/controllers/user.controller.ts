import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { User } from 'src/core/decorators/user.decorator';
import { UserDocument } from '../entities/user.schema';
import { Message } from 'src/core/decorators/message.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get('me')
  @Message('Sucessfully fetched the logged user!')
  public loggedUser(@User() user: UserDocument) {
    return user;
  }

  @Get(':username')
  @Message('Sucessfully fetched the user!')
  public async getByUsername(@Param('username') username: string): Promise<UserDocument | null> {
    return this.userRepository.findByUsername(username);
  }
}
