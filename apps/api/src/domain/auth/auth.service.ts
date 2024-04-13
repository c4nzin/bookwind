import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UserDocument } from '../user/entities/user.schema';
import { UserRepository } from '../user/repositories';
import { RegisterUserDto, LoginDto } from './dto';
import { LoginReturn, LogoutResponse } from './types/base.types';

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

  public async validate(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
    console.log(username);
    const user = await this.userRepository.findOne({ username });

    const isCorrectPasswords = await this.userRepository.comparePasswords(
      password,
      user.password,
    );

    if (!isCorrectPasswords) return null;
    if (!user) return null;

    return user;
  }

  //hard coded - need refactor
  public async login(loginDto: LoginDto): Promise<LoginReturn> {
    return {
      message: {
        title: 'Succesfully logged in',
        body: loginDto,
      },
      statusCode: HttpStatus.OK,
    };
  }

  public async logout(@Req() req: ExpressRequest): Promise<LogoutResponse> {
    const { statusCode } = req.body;
    return new Promise<LogoutResponse>((resolve, reject) => {
      req.logOut((err) => {
        if (err) reject(err);
        resolve({
          message: 'logged out',
          statusCode,
        });
      });
    });
  }
}
