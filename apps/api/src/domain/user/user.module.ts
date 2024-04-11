import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModel } from './entities/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserModel }]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
