import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { User } from 'src/core/decorators/user.decorator';
import { UserDocument } from '../entities/user.schema';
import { Message } from 'src/core/decorators/message.decorator';
import { Request } from 'express';

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
  public async getByUsername(
    @Param('username') username: string,
  ): Promise<UserDocument | null> {
    return this.userRepository.findByUsername(username);
  }

  @Post(':id/follow')
  @Message('Sucessfully followed the user')
  public async followUser(
    @Param('id') id: string,
    @User() user: UserDocument,
  ): Promise<void> {
    return this.userRepository.follow(user.id, id);
  }

  @Post(':id/unfollow')
  @Message('You successfuly unfollowed the user!')
  public async unfollowUser(
    @User() user: UserDocument,
    @Param('id') id: string,
  ): Promise<void> {
    return this.userRepository.unfollow(user, id);
  }

  @Get(':id/followers')
  @Message('Sucessfully fetched the followers')
  public async getFollowers(@Param('id') id: string, @Req() request: Request) {
    return this.userRepository.getFollowingsOrFollowers(id, request);
  }

  @Get(':id/followings')
  @Message('Sucessfully fetched the followings of user')
  public async getFollowings(@Param('id') id: string, @Req() request: Request) {
    return this.userRepository.getFollowingsOrFollowers(id, request);
  }
}
