import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserDocument } from '../../user/entities/user.schema';
import { RegisterUserDto, LoginDto, TwilioDto } from '../dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Message } from 'src/core/decorators/message.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('register')
  @HttpCode(200)
  @Message('Sucessfully registered!')
  public async register(@Body() registerUserDto: RegisterUserDto): Promise<UserDocument> {
    this.eventEmitter.emit('user-registered', {
      username: registerUserDto.username,
    });

    return this.authService.register(registerUserDto);
  }

  //TODO : make some changes in TwilioDto because it has some bad logic
  //maybe use @User decorator to access logged user

  @UseGuards(AuthGuard)
  @Post('phone/verify')
  @HttpCode(200)
  public verifyPhone(@Req() request: Request, @Body() twilioDto?: TwilioDto) {
    return this.authService.verifyPhone(request);
  }

  //maybe use @User decorator to access logged user
  @UseGuards(AuthGuard)
  @Post('phone/verify/token')
  public async validatePhoneVerification() {
    //implement verification method in service
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @Message('Sucessfully logged in!')
  public async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('logout')
  @Message('Sucessfully logged out!')
  public async logout(@Req() request: Request) {
    return this.authService.logout(request);
  }
}
