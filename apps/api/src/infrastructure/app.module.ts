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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from './jwt/jwt.module';
import { IsFieldUniqueConstraint } from 'src/core/decorators';
import { ThrottlerModule } from '../infrastructure/throttler';
@Module({
  imports: [
    EnvalidModule.forRoot({ validators, isGlobal: true, useDotenv: true }),
    LoggerModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    MailModule,
    EventEmitterModule.forRoot({ global: true }),
    JwtModule,
    ThrottlerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    IsFieldUniqueConstraint,
  ],
})
export class AppModule {}
