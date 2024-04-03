import { validators } from '@common/config';
import { Module } from '@nestjs/common';
import { EnvalidModule } from 'nestjs-envalid';
import { LoggerModule } from './logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@algoan/nestjs-logging-interceptor';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    EnvalidModule.forRoot({ validators, isGlobal: true, useDotenv: true }),
    LoggerModule,
    DatabaseModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
