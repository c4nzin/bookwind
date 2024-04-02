import { UserRepository } from '@features/user/repositories';
import { UserSchema } from '@features/user/user.schema';
import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';

//DONT FORGET TO ADD EVENT EMITTER MODULE AND CLASS

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async validate(
    username: string,
    password: string,
  ): Promise<UserSchema | null> {
    const user = await this.userRepository.findOne({ username });
    const passwordChecker = await this.userRepository.comparePasswords(
      password,
      user.password,
    );

    if (!user) return null;
    if (!passwordChecker) return null;

    return user;
  }

  public async registerUser(
    registerUserDto: RegisterUserDto,
  ): Promise<UserSchema> {
    const user = await this.userRepository.create(registerUserDto);

    return user;
  }
}
