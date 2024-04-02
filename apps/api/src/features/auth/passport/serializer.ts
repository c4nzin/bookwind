import { UserRepository } from '@features/user/repositories';
import { UserSchema } from '@features/user/user.schema';
import { PassportSerializer } from '@nestjs/passport';

export class Serializer extends PassportSerializer {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  public async deserializeUser(payload: string, done: Function): Promise<void> {
    const loggedUser = await this.userRepository.findById(payload);

    if (!loggedUser) done(null, false);
    done(null, loggedUser);
  }

  public serializeUser(user: UserSchema, done: Function): void {
    done(null, user._id);
  }
}
