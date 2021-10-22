import { BadRequestException, NestInterceptor } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Load, LoadDocument } from '../schemas/load.schema';
import { noUserLoad } from '../constants/constants';
import { EnumStatus } from '../constants/enums';

export class LoadInterceptor implements NestInterceptor {
  constructor(@InjectModel(Load.name) private loadModel: Model<LoadDocument>) {}
  async intercept(context, next) {
    const req = context.switchToHttp().getRequest();
    const loads = await this.loadModel.find({ assigned_to: req.user.id });
    const [load] = loads.filter((load) => load.status !== EnumStatus.SHIPPED);
    if (!load) {
      throw new BadRequestException({ message: noUserLoad });
    }
    req.load = load;
    return next.handle();
  }
}
