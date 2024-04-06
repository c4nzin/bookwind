import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UserSchema } from 'src/domain/user/entities/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username' });
  }

  public async validate(
    password: string,
    username: string,
  ): Promise<UserSchema> {
    return await this.authService.validate(password, username);
  }
}
