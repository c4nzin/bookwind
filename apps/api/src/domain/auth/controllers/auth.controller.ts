import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserDocument } from '../../user/entities/user.schema';
import { RegisterUserDto, LoginDto } from '../dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Message } from 'src/core/decorators/message.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Message('Sucessfully registered!')
  public async register(@Body() registerUserDto: RegisterUserDto): Promise<UserDocument> {
    this.eventEmitter.emit('user-registered', {
      username: registerUserDto.username,
    });

    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Message('Sucessfully logged in!')
  public async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @Message('Sucessfully logged out!')
  public async logout(@Req() request: Request) {
    return this.authService.logout(request);
  }
}
