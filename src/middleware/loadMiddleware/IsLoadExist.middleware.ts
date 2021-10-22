import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Load, LoadDocument } from '../../schemas/load.schema';
import { Model } from 'mongoose';
import { noLoad } from '../../constants/constants';

export class IsLoadExistMiddleware implements NestMiddleware {
  constructor(@InjectModel(Load.name) private loadModel: Model<LoadDocument>) {}
  async use(req, res, next) {
    if (req.originalUrl !== '/api/loads/active') {
      const { id } = req.params;
      const load = await this.loadModel.findById(id);
      if (!load) {
        throw new BadRequestException({ message: noLoad });
      }
      req.load = load;
    }
    next();
  }
}
