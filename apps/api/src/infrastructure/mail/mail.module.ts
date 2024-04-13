import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailFactory } from './mail.factory';

@Module({
  imports: [MailerModule.forRootAsync({ useClass: MailFactory })],
  controllers: [],
  providers: [],
})
export class MailModule {}
