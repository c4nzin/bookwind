import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserSchema = HydratedDocument<User>;

export enum GENDER {
  NOT_KNOWN,
  MALE,
  FEMALE,
  NON_BINARY,
}

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    type: String,
    trim: true,
  })
  public username: string;

  @Prop({
    required: true,
    type: String,
  })
  public fullname: string;

  @Prop({
    unique: true,
    match: [/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/, 'Please enter a valid email'],
    required: [true, 'This field must be contain an email'],
  })
  public mail: string;

  @Prop({
    required: true,
  })
  public password: string;

  @Prop({
    required: true,
    type: Number,
    enum: GENDER,
    default: GENDER.NOT_KNOWN,
  })
  public gender: string;

  @Prop({
    match: [
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
      'Please enter your phone number',
    ],
    required: false, // its false because i am not planning to implement sms validation feature in mvp version
  })
  public phoneNumber: number;

  @Prop({
    type: String,
    required: true,
    default: process.env.DEFAULT_PROFILE_PHOTO,
    match: [/^(https?):\/\/[^\s$.?#].[^\s]*$/gm, 'url is not valid'],
  })
  public profilePhotoURL: string;

  @Prop({
    type: String,
    maxlength: 150,
  })
  public biography: string;
}

export const UserModel = SchemaFactory.createForClass(User);

UserModel.pre('save', async function (next) {
  if (!this.isModified(this.password)) {
    const hashedPassword = await bcrypt.hash(this.password, 10);

    this.password = hashedPassword;
    next();
  }
});
