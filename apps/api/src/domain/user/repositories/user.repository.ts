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

  public async getFollowers(id: string, request: Request) {
    return this.getFollowingsOrFollowers(id, request);
  }

  public async getFollowings(id: string, request: Request) {
    return this.getFollowingsOrFollowers(id, request);
  }
}
