import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { UserDocument } from 'src/domain/user/entities/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public async validate(password: string, username: string): Promise<UserDocument> {
    const user = await this.authService.validate(password, username);

    if (!user) throw new UnauthorizedException('Password or username not matching');

    return user;
  }
}
