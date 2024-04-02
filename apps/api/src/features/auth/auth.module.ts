import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './passport/strategies/local.strategy';
import { Serializer } from './passport/serializer';
import { UserRepository } from '@features/user/repositories';
import { UserModule } from '@features/user/user.module';

@Module({
  imports: [PassportModule.register({ session: true }), UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, Serializer, UserRepository],
})
export class AuthModule {}
