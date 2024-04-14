import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

interface UserPayload {
  'user-registered': { fullname: string; email: string };
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('user-registered')
  public async registeredUser(
    data: UserPayload['user-registered'],
  ): Promise<void> {
    const { email, fullname } = data;

    const subject = `Welcome to our social book app, ${fullname}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: '/templates/welcome',
      context: {
        fullname,
      },
    });
  }
}
