import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import {
  passwordChanged,
  profileDeleted,
  serverError,
} from '../../constants/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getMe(id: number) {
    try {
      const user = await this.userModel.findById(id);
      return {
        user: {
          _id: user._id,
          role: user.role,
          email: user.email,
          createdDate: user.createdAt,
        },
      };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }
  async updatePassword(password: string, id: number) {
    const hashPassword = await bcrypt.hash(password, 5);
    await this.userModel.findByIdAndUpdate(id, {
      password: hashPassword,
    });
    return { message: passwordChanged };
  }
  async delete(id: number) {
    try {
      await this.userModel.findByIdAndDelete(id);
      return {
        message: profileDeleted,
      };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }
}
