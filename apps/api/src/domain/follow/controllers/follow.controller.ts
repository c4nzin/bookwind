import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repositories';
import { FollowRepository } from '../repositories';
import { Message, User } from 'src/core/decorators';
import { UserDocument } from 'src/domain/user/entities';
import { Request } from 'express';

@Controller('follow')
export class FollowController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
  ) {}

  @Post(':id/follow')
  @Message('Sucessfully followed the user')
  public async followUser(@Param('id') id: string, @User() user: UserDocument): Promise<void> {
    return this.followRepository.follow(user, id);
  }

  @Post(':id/unfollow')
  @Message('You successfuly unfollowed the user!')
  public async unfollowUser(@User() user: UserDocument, @Param('id') id: string): Promise<void> {
    return this.followRepository.unfollow(user, id);
  }

  //Bad code and doing nothing!!!!!!
  //TODO: Come up with different approach like : returning user's entity directly
  @Get(':id/followers')
  @Message('Sucessfully fetched the followers')
  public async getFollowers(@Param('id') id: string, @Req() request: Request) {
    return this.userRepository.getFollowingsOrFollowers(id, request);
  }

  //do the same
  @Get(':id/followings')
  @Message('Sucessfully fetched the followings of user')
  public async getFollowings(@Param('id') id: string, @Req() request: Request) {
    return this.userRepository.getFollowingsOrFollowers(id, request);
  }
}
