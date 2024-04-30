import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './sessions';
import { UserModule } from '../user/user.module';
import { JwtService } from '@modules/jwt';
import { TwilioService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from '../user/entities';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    UserModule,
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, JwtService, TwilioService],
})
export class AuthModule {}
