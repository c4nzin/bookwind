import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from 'src/domain/user/entities';

export type FollowDocument = HydratedDocument<Follow>;

@Schema({
  timestamps: true,
})
export class Follow {
  @Prop({
    ref: 'User',
    type: Types.ObjectId,
  })
  public follower: Types.ObjectId;

  @Prop({
    ref: 'User',
    type: Types.ObjectId,
  })
  public following: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass<Follow>(Follow);
