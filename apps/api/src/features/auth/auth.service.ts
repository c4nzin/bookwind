import { UserRepository } from '@features/user/repositories';
import { UserSchema } from '@features/user/user.schema';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async validate(
    password: string,
    username: string,
  ): Promise<UserSchema> {
    const user = await this.userRepository.findOne({ username });

    const isPasswordMatching = await this.userRepository.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordMatching)
      throw new BadRequestException('Invalid Credentials');

    return user;
  }

  public async login(): Promise<{
    message: string;
    statusCode: number;
  }> {
    return {
      message: 'Sucessfully joined to our app!',
      statusCode: HttpStatus.OK,
    };
  }

  public async logout(@Req() req: ExpressRequest): Promise<void> {
    req.session.destroy(() => {
      return {
        message: 'Sucesfully logged out in our app',
        statusCode: HttpStatus.OK,
      };
    });
  }
}
