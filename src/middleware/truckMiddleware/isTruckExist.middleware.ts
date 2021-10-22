import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Truck, TruckDocument } from '../../schemas/truck.schema';
import { noTruck } from '../../constants/constants';

export class IsTruckExistMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Truck.name) private notesModel: Model<TruckDocument>,
  ) {}
  async use(req, res, next) {
    const { id } = req.params;
    const truck = await this.notesModel.findById(id);
    if (!truck) {
      throw new BadRequestException({ message: noTruck });
    }
    req.truck = truck;
    next();
  }
}
