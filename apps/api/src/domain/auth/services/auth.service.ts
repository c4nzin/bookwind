import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Otp, OtpDocument, UseCase, UserDocument } from '../../user/entities/user.schema';
import { UserRepository } from '../../user/repositories';
import { LoginDto, RegisterUserDto } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { generate } from 'otp-generator';
import moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TwilioService } from './twilio.service';

//TODO : move this code into another file
export const getExpiry = () => {
  const createdAt = new Date();
  const expiresAt = moment(createdAt).add(5, 'minutes').toDate();
  return expiresAt;
};

export function isTokenExpired(expiry: Date): boolean {
  const expirationDate = new Date(expiry);
  const currentDate = new Date();
  return expirationDate.getTime() <= currentDate.getTime();
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    private readonly twilioService: TwilioService,
  ) {}

  public async register(registerUserDto: RegisterUserDto) {
    const user = await this.userRepository.findOne({
      username: registerUserDto.username,
    });

    if (user) throw new BadRequestException('user already registered');

    return this.userRepository.create(registerUserDto);
  }

  public async validate(username: string, password: string): Promise<UserDocument | null> {
    const user = await this.userRepository.findOne({ username });

    const isCorrectPasswords = await this.userRepository.validatePassword(password, user.password);

    if (!isCorrectPasswords || !user) return null;

    //add 2fa here

    if (!user.twoFactorAuthentication) {
      this.create2faPayload(user);
    }

    return user;
  }

  public async login(loginDto: LoginDto): Promise<void> {}

  public async logout(@Req() req: ExpressRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      req.logOut({ keepSessionInfo: false }, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }

  public async create2faPayload(currentUser: UserDocument): Promise<{ success: boolean; accessToken: string }> {
    const payload = {
      email: currentUser.mail,
      fullname: currentUser.fullname,
      sub: currentUser.id,
    };

    const accessToken = await this.generateAccessToken(payload);

    return {
      success: true,
      accessToken,
    };
  }

  public async verifyPhone(req: ExpressRequest) {
    const userDetails = req['user'] as any;
    const user = await this.userRepository.findById(userDetails.id);

    if (!user) {
      throw new BadRequestException('No user found');
    }

    if (user.isPhoneVerified) {
      return { success: true };
    }

    const otp = generate(6, { upperCaseAlphabets: true, specialChars: true, lowerCaseAlphabets: true });

    const otpPayload: Otp = {
      useCase: UseCase.PHV,
      code: otp,
      owner: user.id,
      expiresAt: getExpiry(),
    };

    await this.otpModel.create(otpPayload);

    await this.twilioService.sendSms(user.phoneNumber, `Use this code ${otp} code to verify your phone number`);

    return { success: true };
  }

  private async generateAccessToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
