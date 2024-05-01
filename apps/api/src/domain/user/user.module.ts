import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema, User, UserSchema } from './entities/user.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { JwtService } from '@modules/jwt';

export const mongooseModuleFactories = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Otp.name, schema: OtpSchema },
]);

@Module({
  imports: [mongooseModuleFactories],
  controllers: [UserController],
  providers: [UserRepository, UserService, JwtService],
  exports: [UserRepository, mongooseModuleFactories],
})
export class UserModule {}
