import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { JwtService } from '@modules/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserRepository, UserService, JwtService],
  exports: [UserRepository],
})
export class UserModule {}
