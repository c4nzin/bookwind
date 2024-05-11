import { ENV, Config } from '@infrastructure/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { USER_REGISTERED } from 'src/domain/auth/constants';
import { UserDocument } from 'src/domain/user/entities/user.schema';

interface UserPayload {
  'user-registered': { fullname: string; mail: string };
}

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(ENV) private config: Config,
    private readonly jwtService: JwtService,
  ) {}

  @OnEvent(USER_REGISTERED)
  public async registeredUser(data: UserPayload['user-registered']): Promise<void> {
    const { mail, fullname } = data;

    console.log(data.mail);

    const subject = `Welcome to our social book app, ${fullname}`;

    await this.mailerService.sendMail({
      to: mail,
      subject,
      //make a file
      html: `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Welcome to Social Book</title>
          <style>
            * {
              margin: 0;
              padding: 0;
            }
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
            }
      
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
      
            h1 {
              color: #333;
            }
      
            p {
              color: #666;
            }
      
            .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to our social book app, <%= fullname %></h1>
            <p>Dear <%= fullname %>,</p>
            <p>
              We are thrilled to have you join our community! You are now part of
              Bookwind, where you can connect with friends, share stories, and explore
              new ideas.
            </p>
            <p>Feel free to start exploring and connecting right away!</p>
            <p class="footer">Best regards,<br />The Social Book Team</p>
          </div>
        </body>
      </html>
      `,
      context: {
        fullname,
      },
    });
  }

  @OnEvent(USER_REGISTERED)
  public async verificationMail(user: UserDocument): Promise<void> {
    const token = await this.generateToken(user.id);

    const verificationEmailUrl = this.buildVerificationUrl(token);

    await this.sendVerificationEmail(user.mail, verificationEmailUrl);
  }

  private async generateToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ userId }, { expiresIn: '2d', secret: this.config.EXPRESS_SESSION_SECRET });
  }

  private buildVerificationUrl(token: string): string {
    return `http://localhost:${this.config.PORT}/${this.config.GLOBAL_PREFIX}/auth/authorize?token=${token}`;
  }

  private async sendVerificationEmail(email: string, verificationEmailUrl: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Please verify your email',
      // template: '/templates/verifyMail', // make with ejs file instead using plain html
      html: `<div> 
        <a href="${verificationEmailUrl}">Click here to verify</a>
      </div>`,
    });
  }
}
