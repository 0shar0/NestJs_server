import { BadRequestException, CanActivate } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Load, LoadDocument } from '../schemas/load.schema';
import { Model } from 'mongoose';
import { EnumStatus } from '../constants/enums';
import { finishLoad } from '../constants/constants';

export class IsUserHasActiveLoadsGuard implements CanActivate {
  constructor(@InjectModel(Load.name) private loadModel: Model<LoadDocument>) {}
  async canActivate(context) {
    const { user } = context.switchToHttp().getRequest();
    const loads = await this.loadModel.find({ assigned_to: user.id });
    if (!loads.filter((load) => load.status !== EnumStatus.SHIPPED).length) {
      return true;
    }
    throw new BadRequestException({ message: finishLoad });
  }
}
