import { Inject, Injectable } from '@nestjs/common';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Config, ENV } from '@modules/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Injectable()
export class MailFactory implements MailerOptionsFactory {
  constructor(@Inject(ENV) private readonly config: Config) {}
  public async createMailerOptions(): Promise<MailerOptions> {
    return {
      transport: {
        host: this.config.MAIL_HOST,
        from: `"bookwind" <${this.config.GOOGLE_EMAIL}>`,
        secure: false, //for now
        auth: {
          user: this.config.GOOGLE_EMAIL,
          pass: this.config.GOOGLE_PASSWORD,
        },
        service: 'gmail',
        tls: { rejectUnauthorized: false }, //to avoid any potential authorization err
      },
      defaults: {
        from: `"bookwind" <${this.config.GOOGLE_EMAIL}>`,
      },
      template: {
        adapter: new EjsAdapter(),
        dir: __dirname + '/templates/',
      },
    } as MailerOptions;
  }
}
