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

  // public async comparePasswords(
  //   username: string,
  //   password: string,
  // ): Promise<boolean> {
  //   const user = await this.userRepository
  //     .findOne({ username })
  //     .select('+password');

  //   if (!user) return false;

  //   return bcrypt.compareSync(password, user.password);
  // }

  public async findUserOrThrow(username: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  public async findAll() {
    return await this.find({});
  }
}