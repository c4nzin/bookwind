import { AuthService } from '@features/auth/services/auth.service';
import { UserSchema } from '@features/user/user.schema';
import { BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public async validate(
    username: string,
    password: string,
  ): Promise<UserSchema> {
    const user = await this.authService.validate(username, password);

    if (!user)
      throw new BadRequestException('username or password are not matching');

    return user;
  }
}
