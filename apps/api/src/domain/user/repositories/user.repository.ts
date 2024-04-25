import { BaseRepository } from 'src/core/repositories';
import { User, UserDocument } from '../entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { extractPathFromUrl } from './utils';

export enum FollowerRoutes {
  FOLLOWINGS = 'followings',
  FOLLOWERS = 'followers',
}

export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<UserDocument>,
  ) {
    super(userRepository);
  }

  public async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

    if (!isPasswordMatch) throw new BadRequestException('Invalid Password!');

    return isPasswordMatch;
  }

  public async verifyEmail() {}

  public async findUserOrThrow(_id: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ _id });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  public async findAll() {
    return this.find({});
  }

  public async findByUsername(username: string): Promise<UserDocument> {
    return this.findOne({ username });
  }

  //Follow user
  //TODO : move "follow" method to follow service
  //TODO : this isn't right to store in follow service
  public async follow(loggedUserId: string, targetId: string): Promise<void> {
    if (loggedUserId === targetId) {
      throw new BadRequestException('You can not follow yourself');
    }

    const isAlreadyFollowing = await this.controlIfFollowingOrNot(
      loggedUserId,
      targetId,
    );

    await this.findUserOrThrow(targetId);

    if (isAlreadyFollowing) {
      throw new BadRequestException('You already following current user');
    }

    //old solution, will be removed soon
    // await this.userRepository.updateOne(
    //   { _id: loggedUserId },
    //   { $push: { following: targetId } },
    // );

    // await this.userRepository.updateOne(
    //   { _id: targetId },
    //   { $push: { follower: loggedUserId } },
    // );

    //a new approach to use
    await this.userRepository.updateMany(
      {
        $or: [{ _id: loggedUserId }, { _id: targetId }],
      },
      {
        $push: { following: targetId, follower: loggedUserId },
      },
    );
  }

  //TODO : make a follow schema and service also an repository
  public async unfollow(
    loggedUser: UserDocument,
    targetUserId: string,
  ): Promise<void> {
    if (loggedUser.id === targetUserId) {
      throw new BadRequestException('You can not unfollow yourself');
    }

    const isFollowing = await this.controlIfFollowingOrNot(
      loggedUser.id,
      targetUserId,
    );

    if (!isFollowing)
      throw new BadRequestException('No user found to unfollow');

    await this.findUserOrThrow(targetUserId);

    //old solution, will be removed soon
    // await this.userRepository.updateOne(
    //   { _id: loggedUser.id },
    //   { $pull: { following: targetUserId } },
    // );

    // await this.userRepository.updateOne(
    //   { _id: targetUserId },
    //   { $pull: { follower: loggedUser.id } },
    // );

    //a new approach to fix
    await this.userRepository.updateMany(
      {
        $or: [{ _id: loggedUser.id }, { _id: targetUserId }],
      },
      {
        $pull: { following: targetUserId, follower: loggedUser.id },
      },
    );
  }

  public async controlIfFollowingOrNot(
    loggedUserId: string,
    targetUserId: string,
  ): Promise<boolean> {
    const isAlreadyFollowing = await this.findOne({
      _id: loggedUserId,
      following: targetUserId,
    });

    return !!isAlreadyFollowing;
  }

  //Not done yet
  //Those 2 methods are similar and doing almost same job. So try to find a way to merge into one OK OK
  //a new approach to fix bad code
  public async getFollowingsOrFollowers(id: string, request: Request) {
    const url = request.url;
    const path: string =
      extractPathFromUrl(url) === FollowerRoutes.FOLLOWINGS
        ? FollowerRoutes.FOLLOWINGS
        : FollowerRoutes.FOLLOWERS;

    const user = await this.userRepository.findById(id);

    let userIds: Types.ObjectId[] = [];

    if (path === FollowerRoutes.FOLLOWERS) {
      userIds = user.follower;
    } else {
      userIds = user.following;
    }

    const users = await Promise.all(
      userIds.map((userId) => this.userRepository.findById(userId)),
    );

    return users.map((user) => user.username);
  }

  //OLD ONE
  //  public async convertAllFollowersToUsername(id: string) {
  //   // const usernames: string[] = new Array();
  //   const user = await this.userRepository.findById(id).orFail();

  //   const followerIds = user.follower.map((followerId: Types.ObjectId) =>
  //     this.userRepository.findById(followerId),
  //   );

  //   const followerOfUsers = await Promise.all(followerIds);

  //   const usernames = followerOfUsers.map((follower) => follower.username);

  //   return usernames;
  // }

  // public async convertAllFollowingsToUsername(id: string): Promise<string[]> {
  //   const user = await this.userRepository.findById(id).orFail();

  //   const followingIds = user.following.map((followingIds: Types.ObjectId) =>
  //     this.userRepository.findById(followingIds),
  //   );

  //   const followingsOfUser = await Promise.all(followingIds);

  //   const usernames = followingsOfUser.map((following) => following.username);

  //   return usernames;
  // }

  public async getFollowers(id: string, request: Request) {
    return this.getFollowingsOrFollowers(id, request);
  }

  public async getFollowings(id: string, request: Request) {
    return this.getFollowingsOrFollowers(id, request);
  }
}
