import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/repositories';
import { Follow, FollowDocument } from '../entities/follow.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from 'src/domain/user/repositories';
import { User, UserDocument } from 'src/domain/user/entities';
import { UpdateResult } from 'src/core/repositories/types/queries.types';

@Injectable()
export class FollowRepository extends BaseRepository<Follow> {
  constructor(
    @InjectModel(Follow.name)
    private readonly followRepository: Model<FollowDocument>,
    private readonly userRepository: UserRepository,
  ) {
    super(followRepository);
  }

  public async follow(loggedUser: UserDocument, targetUserId: string): Promise<void> {
    if (loggedUser.id === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const isFollowing = await this.isFollowing(loggedUser.id, targetUserId);

    await this.ensureUserExists(targetUserId);

    if (isFollowing) {
      throw new BadRequestException('You already following current user');
    }

    await this.userRepository.updateOne({ _id: loggedUser.id }, { $push: { following: targetUserId } });

    await this.userRepository.updateOne({ _id: targetUserId }, { $push: { follower: loggedUser.id } });
  }

  public async unfollow(loggedUser: UserDocument, targetUserId: string): Promise<void> {
    console.log('unfollow calisti');
    if (loggedUser.id === targetUserId) {
      throw new BadRequestException('Cannot unfollow yourself');
    }

    const isFollowing = await this.isFollowing(loggedUser.id, targetUserId);

    if (!isFollowing) {
      throw new BadRequestException('Cannot unfollow a user you are not following');
    }

    await this.userRepository.findUserOrThrow(targetUserId);

    await this.userRepository.updateOne({ _id: loggedUser.id }, { $pull: { following: targetUserId } });

    await this.userRepository.updateOne({ _id: targetUserId }, { $pull: { follower: loggedUser.id } });
  }

  private async ensureUserExists(userId: string): Promise<UserDocument> {
    return this.userRepository.findUserOrThrow(userId);
  }

  public async isFollowing(loggedUserId: string, targetUserId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ _id: loggedUserId, following: targetUserId });
    return !!user;
  }
}
