import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModel } from './entities/user.schema';
import { Follow, FollowModel } from './entities/follow.schema';
import { Post, PostModel } from './entities/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserModel },
      { name: Follow.name, schema: FollowModel },
      { name: Post.name, schema: PostModel },
    ]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
