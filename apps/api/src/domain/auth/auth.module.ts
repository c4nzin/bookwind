import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { Session } from './sessions';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PassportModule.register({ session: true }), UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, Session],
})
export class AuthModule {}
