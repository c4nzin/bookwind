import { Module } from '@nestjs/common';
import { FollowController } from './controllers';
import { FollowRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './entities';
import { UserRepository } from '../user/repositories';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    UserModule,
  ],
  controllers: [FollowController],
  providers: [FollowRepository],
  //export follow service's itself when i implement the follow service
  exports: [FollowRepository],
})
export class FollowModule {}
