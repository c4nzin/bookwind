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

  public async follow(loggedUserId: string, targetUserId: string): Promise<void> {
    const targetUser = await this.userRepository.findById(targetUserId).select('-password -mail');
    const loggedUser = await this.userRepository.findById(loggedUserId).select('-password -mail');

    if (loggedUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const isFollowing = await this.isFollowing(loggedUserId, targetUserId);

    await this.ensureUserExists(targetUserId);

    if (isFollowing) {
      throw new BadRequestException('You already following current user');
    }

    await this.userRepository.updateOne({ _id: loggedUserId }, { $push: { following: targetUser } });

    await this.userRepository.updateOne({ _id: targetUserId }, { $push: { follower: loggedUser } });
  }

  public async unfollow(loggedUserId: string, targetUserId: string): Promise<void> {
    const targetUser = await this.userRepository.findById(targetUserId).select('-password -mail');
    const loggedUser = await this.userRepository.findById(loggedUserId).select('-password -mail');

    if (loggedUser.id === targetUserId) {
      throw new BadRequestException('Cannot unfollow yourself');
    }

    const isFollowing = await this.isFollowing(loggedUser.id, targetUserId);

    if (!isFollowing) {
      throw new BadRequestException('Cannot unfollow a user you are not following');
    }

    await this.ensureUserExists(targetUserId);

    await this.userRepository.updateOne({ _id: loggedUser.id }, { $pull: { following: targetUser } });

    await this.userRepository.updateOne({ _id: targetUserId }, { $pull: { follower: loggedUser } });
  }

  private async ensureUserExists(userId: string): Promise<UserDocument> {
    return this.userRepository.findUserOrThrow(userId);
  }

  public async isFollowing(loggedUserId: string, targetUserId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ _id: loggedUserId, following: targetUserId });
    return !!user;
  }

  //add return type
  public async getFollowings(userId: string, docToSkip = 0, limitToDoc?: number) {
    const user = await this.userRepository.findById(userId).select('following');

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    const queryWithPaginate = await this.userRepository
      .find({ _id: { $in: user.following } })
      .select('-password -mail')
      .skip(docToSkip)
      .limit(limitToDoc);

    const totalFollowings = user.following.length;
    const results = queryWithPaginate;

    return { results, totalFollowings };
  }

  public async getFollowers(userId: string, skipToDoc = 0, limitToDoc?: number) {
    const user = await this.userRepository.findById(userId).select('follower');

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const queryWithPaginate = await this.userRepository
      .find({ _id: { $in: user.follower } })
      .select('-password -mail')
      .skip(skipToDoc)
      .limit(limitToDoc);

    const totalFollowers = user.follower.length;
    const results = queryWithPaginate;

    return { results, totalFollowers };
  }

  public async mergeTwoDocuments(documentOne: FollowDocument, documentTwo: UserDocument) {} //not using rn
}
