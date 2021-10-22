import { BadRequestException, NestInterceptor } from '@nestjs/common';
import { noUser } from '../constants/constants';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

export class UserInterceptor implements NestInterceptor {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async intercept(context, next) {
    const req = context.switchToHttp().getRequest();
    const user = await this.userModel.findOne({ email: req.body.email });
    if (!user) {
      throw new BadRequestException({ message: noUser });
    }
    req.user = user;
    return next.handle();
  }
}
