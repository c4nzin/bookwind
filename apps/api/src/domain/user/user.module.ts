import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { Follow, FollowSchema } from './entities/follow.schema';
import { Post, PostSchema } from './entities/post.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}
