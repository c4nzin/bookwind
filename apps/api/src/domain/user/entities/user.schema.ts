import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

enum Roles {
  user = 'User',
  admin = 'Admin',
}

enum Gender {
  female = 'Female',
  male = 'Male',
  other = 'Other',
}

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    type: String,
    trim: true,
    match: [/^[a-zA-Z0-9]+$/, 'Please enter a valid username'],
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
    type: Boolean,
    default: false,
  })
  public isEmailVerified: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  public isPhoneVerified: string;

  @Prop({
    required: true,
  })
  public password: string;

  @Prop({
    required: false,
    type: String,
    enum: Gender,
    default: Gender.other,
  })
  public gender: string;

  @Prop({
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, 'Please enter your phone number'],
    required: false, // its false because i am not planning to implement sms validation feature in 1.0 version
  })
  public phoneNumber: string;

  @Prop({
    type: String,
    required: false,
    default: process.env.DEFAULT_PROFILE_PHOTO,
    match: [/^(https?):\/\/[^\s$.?#].[^\s]*$/gm, 'url is not valid'],
  })
  public profilePhotoURL: string;

  @Prop({
    type: String,
    maxlength: 150,
  })
  public biography: string;

  @Prop({
    type: String,
    enum: Roles,
    default: Roles.user,
  })
  public role: string;

  //not tested yet
  @Prop({
    ref: 'Post',
    type: [Types.ObjectId],
    default: [],
  })
  public posts: Types.ObjectId[];

  //not tested yet
  @Prop({
    ref: 'Follow',
    default: [],
    type: [{ type: Types.ObjectId, ref: 'Follow' }],
  })
  public follower: Types.ObjectId[];

  //not tested yet
  @Prop({
    ref: 'Follow',
    default: [],
    type: [{ type: Types.ObjectId, ref: 'Follow' }],
  })
  public following: Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  public twoFactorAuthentication: string;
}

//Do not forget to seperate otp schema with user.
export const UserSchema = SchemaFactory.createForClass<User>(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified(this.password)) {
    const hashedPassword = await bcrypt.hash(this.password, 10);

    this.password = hashedPassword;
    next();
  }
});
