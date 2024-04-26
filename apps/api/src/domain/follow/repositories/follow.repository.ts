import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/repositories';
import { Follow, FollowDocument } from '../entities/follow.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from 'src/domain/user/repositories';
import { UserDocument } from 'src/domain/user/entities';

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

    await this.updateFollowings(loggedUser.id, targetUserId);
  }

  public async unfollow(loggedUser: UserDocument, targetUserId: string): Promise<void> {
    if (loggedUser.id === targetUserId) {
      throw new BadRequestException('Cannot unfollow yourself');
    }

    const isFollowing = await this.isFollowing(loggedUser.id, targetUserId);

    if (!isFollowing) {
      throw new BadRequestException('Cannot unfollow a user you are not following');
    }

    await this.userRepository.findUserOrThrow(targetUserId);

    await this.updateFollowers(loggedUser.id, targetUserId);
  }

  private async updateFollowers(loggedUserId: string, targetUserId: string): Promise<void> {
    await this.followRepository.updateMany(
      {
        $or: [{ _id: loggedUserId }, { _id: targetUserId }],
      },
      {
        $pull: { following: targetUserId, follower: loggedUserId },
      },
    );
  }

  private async updateFollowings(loggedUserId: string, targetUserId: string): Promise<void> {
    await this.followRepository.updateMany(
      {
        $or: [{ _id: loggedUserId }, { _id: targetUserId }],
      },
      {
        $push: { follower: targetUserId, following: loggedUserId },
      },
    );
  }

  private async ensureUserExists(userId: string): Promise<void> {
    await this.userRepository.findUserOrThrow(userId);
  }

  public async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const isFollowing = await this.findOne({
      followerId,
      following: followingId,
    });

    return !!isFollowing;
  }
}
