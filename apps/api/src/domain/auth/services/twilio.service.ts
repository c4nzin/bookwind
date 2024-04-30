import { Config, ENV } from '@modules/config';
import { Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { TwilioDto } from '../dto';

@Injectable()
export class TwilioService {
  public client: Twilio;
  constructor(@Inject(ENV) private readonly config: Config) {
    this.client = new Twilio(this.config.TWILIO_AUTH_SID, this.config.TWILIO_AUTH_TOKEN);
  }

  public twilioConfigFactory(twilioDto: TwilioDto) {
    console.log(this.sendSms('905437169816', 'hello bro'));

    twilioDto = {
      TWILIO_AUTH_SID: this.config.TWILIO_AUTH_SID,
      TWILIO_AUTH_TOKEN: this.config.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER: this.config.TWILIO_PHONE_NUMBER,
    };
    return twilioDto as TwilioDto;
  }

  public async sendSms(phoneNumber: string, message: string) {
    return await this.client.messages.create({
      from: this.config.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
      body: message,
    });
  }
}
