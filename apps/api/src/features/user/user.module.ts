import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModel } from './user.schema';

const userModelProvider = MongooseModule.forFeature([
  { name: User.name, schema: UserModel },
]);

@Module({
  imports: [userModelProvider],
  providers: [UserRepository],
  exports: [UserRepository, userModelProvider],
})
export class UserModule {}
