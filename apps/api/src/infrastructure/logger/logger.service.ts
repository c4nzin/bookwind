import { Inject, Injectable } from '@nestjs/common';
import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from 'nest-winston';
import { Logtail } from '@logtail/node';
import * as winston from 'winston';
import { createWinstonFormatter } from './winston-formatter';
import { LogtailTransport } from '@logtail/winston';
import { ENV, Config } from '@modules/config';
@Injectable()
export class LoggerService implements WinstonModuleOptionsFactory {
  constructor(@Inject(ENV) private configuration: Config) {}

  public async createWinstonModuleOptions(): Promise<WinstonModuleOptions> {
    const logtail = new Logtail(this.configuration.LOGTAIL_SOURCE);
    const logtailTransports: winston.transport[] = [
      new LogtailTransport(logtail),
    ];

    if (this.configuration.isDevelopment) {
      logtailTransports.push(new winston.transports.Console());
    }

    return {
      exitOnError: true,
      exceptionHandlers: logtailTransports,
      rejectionHandlers: logtailTransports,
      format: createWinstonFormatter(),
      transports: logtailTransports,
    };
  }
}
