import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './sessions';
import { UserModule } from '../user/user.module';
import { JwtService } from '@modules/jwt';

@Module({
  imports: [PassportModule.register({ session: true }), UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, JwtService],
})
export class AuthModule {}
