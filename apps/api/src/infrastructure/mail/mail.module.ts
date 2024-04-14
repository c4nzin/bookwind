import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailConfigService } from './mail-config.service';
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule.forRootAsync({ useClass: MailConfigService })],
  controllers: [],
  providers: [MailService],
})
export class MailModule {}
