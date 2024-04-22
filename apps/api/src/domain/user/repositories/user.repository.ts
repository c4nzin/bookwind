import { BaseRepository } from 'src/core/repositories';
import { User, UserDocument } from '../entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<UserDocument>,
  ) {
    super(userRepository);
  }

  public async comparePasswords(
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
    return await this.find({});
  }

  public async findByUsername(
    username: string,
  ): Promise<UserDocument[] | null> {
    //Remove _id field i dont want to leak it
    const queryFields = [
      'username',
      'fullname',
      'posts',
      'follower',
      'following',
      'createdAt',
    ];

    return this.find({ username }).select(queryFields);
  }

  //Follow user
  //TODO : move "follow" method to user service
  //TODO : this isn't right to store in user repository imo
  public async follow(loggedUserId: string, targetId: string): Promise<void> {
    if (loggedUserId === targetId) {
      throw new BadRequestException('You can not follow yourself');
    }

    //is already following or not
    const isAlreadyFollowing = await this.controlIfFollowingOrNot(
      loggedUserId,
      targetId,
    );

    await this.findUserOrThrow(targetId);

    if (isAlreadyFollowing) {
      throw new BadRequestException('You already following current user');
    }

    await this.userRepository.updateOne(
      { _id: loggedUserId },
      { $push: { following: targetId } },
    );

    await this.userRepository.updateOne(
      { _id: targetId },
      { $push: { follower: loggedUserId } },
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

    await this.userRepository.updateOne(
      { _id: loggedUser.id },
      { $pull: { following: targetUserId } },
    );

    await this.userRepository.updateOne(
      { _id: targetUserId },
      { $pull: { follower: loggedUser.id } },
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

  //TODO : add unfollow mechanicsm
}
