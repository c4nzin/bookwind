import { Config, ENV } from '@modules/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { USER_REGISTERED } from 'src/domain/auth/constants';
import { UserDocument } from 'src/domain/user/entities/user.schema';

interface UserPayload {
  'user-registered': { fullname: string; email: string };
}

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(ENV) private config: Config,
    private readonly jwtService: JwtService,
  ) {}

  @OnEvent(USER_REGISTERED)
  public async registeredUser(
    data: UserPayload['user-registered'],
  ): Promise<void> {
    const { email, fullname } = data;

    const subject = `Welcome to our social book app, ${fullname}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: '/templates/welcome', //not implemented yet
      context: {
        fullname,
      },
    });
  }

  @OnEvent(USER_REGISTERED)
  public async verificationMail(user: UserDocument): Promise<void> {
    const token = await this.generateTokenUrl(user.id);

    const verificationEmailUrl = this.buildVerificationUrl(token);

    await this.sendVerificationEmail(user.mail, verificationEmailUrl);
  }

  private async generateTokenUrl(userId: string): Promise<string> {
    const token = await this.jwtService.signAsync(
      { userId },
      { expiresIn: '2d', secret: this.config.EXPRESS_SESSION_SECRET },
    );
    return token;
  }

  private buildVerificationUrl(token: string): string {
    return `http://localhost:${this.config.PORT}/${this.config.GLOBAL_PREFIX}/auth/authorize?token=${token}`;
  }

  private async sendVerificationEmail(
    email: string,
    verificationEmailUrl: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Please verify your email',
      template: '/templates/verifyMail', // make with ejs file instead using plain html
      html: `<div> 
        <a href="${verificationEmailUrl}">Click here to verify</a>
      </div>`,
    });
  }
}
