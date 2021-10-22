import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type TruckDocument = Truck & mongoose.Document;

@Schema({ timestamps: true })
export class Truck {
  @Prop()
  id: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  created_by: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assigned_to: User;

  @Prop()
  type: 'SPRINTER' | 'SMALL STRAIGHT' | 'LARGE STRAIGHT';

  @Prop()
  status: 'OL' | 'IS';

  @Prop()
  createdAt: Date;
}

export const TruckSchema = SchemaFactory.createForClass(Truck);
