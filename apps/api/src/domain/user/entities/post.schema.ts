//not using rn

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: true,
})
export class Post {
  @Prop({
    required: true,
    type: String,
    maxlength: 300,
    minlength: 2,
  })
  public content: string;

  @Prop({
    ref: 'User',
    type: Types.ObjectId,
  })
  public author: Types.ObjectId; // mb use string?
}

export const PostSchema = SchemaFactory.createForClass<Post>(Post);
