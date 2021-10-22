import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../schemas/user.schema';
import { badPassword } from '../../constants/constants';

export class IsPasswordCorrectMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async use(req, res, next) {
    const { email, password } = req.body;
    const user = await this.userModel.findOne({ email });
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      throw new BadRequestException({ message: badPassword });
    }
    next();
  }
}
