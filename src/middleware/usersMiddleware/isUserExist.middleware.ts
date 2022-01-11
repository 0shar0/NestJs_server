import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { userExist } from 'src/constants/constants';

@Injectable()
export class IsUserExistMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async use(req, res, next) {
    const { email } = req.body;
    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      throw new BadRequestException({ message: userExist });
    }
    next();
  }
}
