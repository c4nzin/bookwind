import { Config, ENV } from '@modules/config';
import { Inject, Injectable } from '@nestjs/common';
import { Resolvable, ThrottlerModuleOptions, ThrottlerOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';

@Injectable()
export class ThrottlerService implements ThrottlerOptionsFactory {
  constructor(@Inject(ENV) private readonly config: Config) {}

  public createThrottlerOptions(): ThrottlerModuleOptions {
    const ttl: Resolvable<number> = this.config.TTL;
    const limit: Resolvable<number> = this.config.LIMIT;

    const throttlerOptions: ThrottlerOptions = {
      ttl,
      limit,
    };

    const throttlerModuleOptions: ThrottlerModuleOptions = {
      throttlers: [throttlerOptions],
    };

    return throttlerModuleOptions;
  }
}
