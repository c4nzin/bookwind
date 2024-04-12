import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserDocument } from '../user/entities/user.schema';
import { UserRepository } from '../user/repositories';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  public serializeUser(user: UserDocument, done: Function): void {
    done(null, user._id);
  }

  public async deserializeUser(userId: string, done: Function): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
