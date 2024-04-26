import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UserDocument } from '../user/entities/user.schema';
import { UserRepository } from '../user/repositories';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(registerUserDto: RegisterUserDto) {
    const user = await this.userRepository.findOne({
      username: registerUserDto.username,
    });

    if (user) throw new BadRequestException('user already registered');

    return this.userRepository.create(registerUserDto);
  }

  public async validate(username: string, password: string): Promise<UserDocument | null> {
    console.log(username);
    const user = await this.userRepository.findOne({ username });

    const isCorrectPasswords = await this.userRepository.validatePassword(password, user.password);

    if (!isCorrectPasswords || !user) return null;

    return user;
  }

  public async login(): Promise<void> {}

  public async logout(@Req() req: ExpressRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      req.logOut({ keepSessionInfo: false }, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }
}
