import { Config, ENV } from '@modules/config';
import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtService implements JwtOptionsFactory {
  constructor(@Inject(ENV) private readonly config: Config) {}
  public async createJwtOptions(): Promise<JwtModuleOptions> {
    return {
      secret: this.config.EXPRESS_SESSION_SECRET,

      signOptions: {
        expiresIn: '2d',
        algorithm: 'HS256',
        header: {
          typ: 'JWT',
          alg: 'HS256',
        },
        notBefore: '0',
      },
    };
  }
}
