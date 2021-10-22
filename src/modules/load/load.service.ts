import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  driverAssigned,
  loadCreated,
  loadDeleted,
  loadUpdated,
  noDriver,
  notAssigned,
  serverError,
} from '../../constants/constants';
import { Load, LoadDocument } from '../../schemas/load.schema';
import { EnumState, EnumStatus, EnumTruckStatus } from '../../constants/enums';
import { Truck, TruckDocument } from '../../schemas/truck.schema';
import {
  findTruckType,
  formatFullInfoLoad,
  formatLoad,
} from '../../constants/helpers';

@Injectable()
export class LoadService {
  constructor(
    @InjectModel(Load.name) private loadModel: Model<LoadDocument>,
    @InjectModel(Truck.name) private truckModel: Model<TruckDocument>,
  ) {}
  async addNew(load, userId) {
    try {
      await this.loadModel.create({
        created_by: userId,
        assigned_to: null,
        status: EnumStatus.NEW,
        state: null,
        ...load,
        logs: [],
      });
      return { message: loadCreated };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  getLoadById(load) {
    try {
      return formatLoad(load);
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async updateLoadById(load, body) {
    try {
      await this.loadModel.findByIdAndUpdate(load._id, { ...body });
      return { message: loadUpdated };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async deleteById(id) {
    try {
      await this.loadModel.findByIdAndDelete(id);
      return { message: loadDeleted };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async getFullInfo(load) {
    try {
      const truck = await this.truckModel.findOne({
        assigned_to: load.assigned_to,
      });
      return formatFullInfoLoad(load, truck);
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async postLoadById(load) {
    try {
      await this.loadModel.findByIdAndUpdate(load._id, {
        status: EnumStatus.POSTED,
      });
      const truckTypes = findTruckType(load.dimensions, load.payload);
      let trucks = await this.truckModel.find({ status: EnumTruckStatus.IS });
      trucks = trucks.filter(
        (truck) =>
          !!truck.assigned_to && truckTypes.some((type) => type === truck.type),
      );
      if (trucks.length) {
        trucks[0].status = EnumTruckStatus.OL;
        trucks[0].save();
        load.assigned_to = trucks[0].assigned_to;
        load.status = EnumStatus.ASSIGNED;
        load.state = EnumState.ROUTE_TO;
        load.logs = [
          ...load.logs,
          {
            message: `Load assigned to driver with id ${trucks[0].assigned_to}`,
            time: new Date(Date.now()),
          },
        ];
        load.save();
        return { message: driverAssigned, driver_found: true };
      }
      await this.loadModel.findByIdAndUpdate(load._id, {
        status: EnumStatus.NEW,
        logs: [
          ...load.logs,
          { message: notAssigned, time: new Date(Date.now()) },
        ],
      });
      return { message: noDriver, driver_found: false };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async updateActive(truck, load) {
    try {
      switch (load.state) {
        case EnumState.ROUTE_TO:
          load.state = EnumState.ARRIVED;
          load.logs = [
            ...load.logs,
            {
              message: EnumState.ARRIVED,
              time: new Date(Date.now()),
            },
          ];
          break;
        case EnumState.ARRIVED:
          load.state = EnumState.DELIVERY;
          load.logs = [
            ...load.logs,
            {
              message: EnumState.DELIVERY,
              time: new Date(Date.now()),
            },
          ];
          break;
        case EnumState.DELIVERY:
          load.state = EnumState.FINISH;
          load.status = EnumStatus.SHIPPED;
          load.logs = [
            ...load.logs,
            {
              message: EnumState.FINISH,
              time: new Date(Date.now()),
            },
          ];
          truck.status = EnumTruckStatus.IS;
          break;
        default:
          break;
      }
      await load.save();
      await truck.save();
      return { message: `Load state changed to '${load.state}'` };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async getActive(load) {
    try {
      return { load: formatLoad(load) };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async getDriversList(id, status, limit = 10, offset = 0) {
    try {
      let fetchLoads;
      if (status) {
        fetchLoads = await this.loadModel.find({ assigned_to: id, status });
      } else {
        fetchLoads = await this.loadModel.find({ assigned_to: id });
      }
      let loads = [...fetchLoads];
      loads = loads.splice(offset).splice(0, limit);
      return { loads: loads.map((load) => formatLoad(load)) };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }

  async getShipperList(id, status, limit = 10, offset = 0) {
    try {
      let fetchLoads;
      if (status) {
        fetchLoads = await this.loadModel.find({ created_by: id, status });
      } else {
        fetchLoads = await this.loadModel.find({ created_by: id });
      }
      let loads = [...fetchLoads];
      loads = loads.splice(offset).splice(0, limit);
      return { loads: loads.map((load) => formatLoad(load)) };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }
}
