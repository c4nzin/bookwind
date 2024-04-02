import { BaseRepository } from '@common/repositories';
import { User, UserSchema } from '../user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

export class UserRepository extends BaseRepository<UserSchema> {
  constructor(
    @InjectModel(User.name) private readonly userRepository: Model<UserSchema>,
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
}
