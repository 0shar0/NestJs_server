import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Load, LoadDocument } from '../schemas/load.schema';
import { notUserLoad } from '../constants/constants';

@Injectable()
export class BelongLoadToThisUserGuard implements CanActivate {
  constructor(@InjectModel(Load.name) private loadModel: Model<LoadDocument>) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const load = req.load;
    const userId = req.user.id;
    if (load.created_by.toString() === userId.toString()) {
      req.load = load;
      return true;
    }
    throw new BadRequestException({ message: notUserLoad });
  }
}
