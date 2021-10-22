import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Dimensions } from '../dto/load.dto';
import { EnumStatus } from '../constants/enums';

export type LoadDocument = Load & mongoose.Document;

class Logs {
  message: string;
  time: Date;
}

@Schema({ timestamps: true })
export class Load {
  @Prop()
  id: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  created_by: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assigned_to: User;

  @Prop()
  status: EnumStatus;

  @Prop()
  state:
    | null
    | 'En route to Pick Up'
    | 'Arrived to Pick Up'
    | 'En route to delivery'
    | 'Arrived to delivery';

  @Prop()
  name: string;

  @Prop()
  payload: number;

  @Prop()
  pickup_address: string;

  @Prop()
  delivery_address: string;

  @Prop()
  dimensions: Dimensions;

  @Prop()
  logs: Logs[];

  @Prop()
  created_date: Date;
}

export const LoadSchema = SchemaFactory.createForClass(Load);
