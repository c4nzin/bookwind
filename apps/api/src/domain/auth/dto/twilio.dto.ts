import { IsString } from 'class-validator';

export class TwilioDto {
  @IsString()
  public TWILIO_AUTH_SID?: string;

  @IsString()
  public TWILIO_AUTH_TOKEN?: string;

  @IsString()
  public TWILIO_PHONE_NUMBER?: string;
}
