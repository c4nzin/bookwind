import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FollowDocument = HydratedDocument<Follow>;

@Schema({
  timestamps: true,
})
export class Follow {
  @Prop({
    ref: 'User',
    type: Types.ObjectId,
  })
  //Being followed
  public follower: Types.ObjectId;

  @Prop({
    ref: 'User',
    type: Types.ObjectId,
  })
  public following: Types.ObjectId;
}

//Change as FollowSchema
export const FollowSchema = SchemaFactory.createForClass<Follow>(Follow);
