import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Truck, TruckDocument } from '../../schemas/truck.schema';
import { Model } from 'mongoose';
import {
  serverError,
  truckAssigned,
  truckChanged,
  truckCreated,
  truckDeleted,
} from '../../constants/constants';

@Injectable()
export class TruckService {
  constructor(
    @InjectModel(Truck.name) private truckModel: Model<TruckDocument>,
  ) {}
  async getAllTrucks(userId) {
    try {
      const trucks = await this.truckModel.find({ created_by: userId });
      return {
        trucks: trucks.map((truck) => ({
          _id: truck._id,
          created_by: truck.created_by,
          assigned_to: truck.assigned_to,
          type: truck.type,
          status: truck.status,
          created_date: truck.createdAt,
        })),
      };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async addNew(type, userId) {
    try {
      await this.truckModel.create({
        created_by: userId,
        assigned_to: null,
        type,
        status: 'IS',
      });
      return { message: truckCreated };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async getOneById(truck) {
    try {
      const { _id, created_by, assigned_to, type, status, createdAt } = truck;
      return {
        _id,
        created_by,
        assigned_to,
        type,
        status,
        created_date: createdAt,
      };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }
  async updateById(truck, body) {
    try {
      await this.truckModel.findByIdAndUpdate(truck._id, {
        ...body,
      });
      return { message: truckChanged };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }
  async deleteById(truckId) {
    try {
      await this.truckModel.findByIdAndDelete(truckId);
      return { message: truckDeleted };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async assign(truck, id) {
    try {
      const [oldTruck] = await this.truckModel.find({ assigned_to: id });
      if (oldTruck) {
        oldTruck.assigned_to = null;
        await oldTruck.save();
      }
      truck.assigned_to = id;
      await truck.save();
      return { message: truckAssigned };
    } catch (e) {
      throw new BadRequestException({ message: serverError });
    }
  }
}
