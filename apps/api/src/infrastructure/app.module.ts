import { validators } from '@modules/config';
import { Module } from '@nestjs/common';
import { EnvalidModule } from 'nestjs-envalid';
import { LoggerModule } from './logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@algoan/nestjs-logging-interceptor';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from 'src/domain/auth/auth.module';
import { UserModule } from 'src/domain/user/user.module';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    EnvalidModule.forRoot({ validators, isGlobal: true, useDotenv: true }),
    LoggerModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
