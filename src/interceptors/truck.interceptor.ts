import { BadRequestException, NestInterceptor } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Truck, TruckDocument } from '../schemas/truck.schema';
import { Model } from 'mongoose';
import { noUserTruck } from '../constants/constants';

export class TruckInterceptor implements NestInterceptor {
  constructor(
    @InjectModel(Truck.name) private truckModel: Model<TruckDocument>,
  ) {}
  async intercept(context, next) {
    try {
      const req = context.switchToHttp().getRequest();
      const [truck] = await this.truckModel.find({ assigned_to: req.user.id });
      req.truck = truck;
      return next.handle();
    } catch (e) {
      throw new BadRequestException({ message: noUserTruck });
    }
  }
}
