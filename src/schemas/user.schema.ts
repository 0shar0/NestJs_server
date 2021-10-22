import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  id: number;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: 'SHIPPER' | 'DRIVER';

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
