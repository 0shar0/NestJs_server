import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  passwordGenerated,
  serverError,
  success,
} from '../../constants/constants';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}
  async register(email: string, password: string, role: string) {
    try {
      const hashPassword = await bcrypt.hash(password, 5);
      await this.userModel.create({
        email,
        password: hashPassword,
        role,
      });
      return { message: success };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }
  async login(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      return {
        message: success,
        jwt_token: this.jwtService.sign({
          email,
          id: user._id,
          role: user.role,
        }),
      };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }
  async sendMail(user) {
    try {
      const password = randomBytes(8).toString('hex');
      user.password = await bcrypt.hash(password, 5);
      await this.mailerService.sendMail({
        to: user.email,
        from: 'my_test_email45@yahoo.com',
        subject: 'Your new password',
        template: './template.hbs',
        context: {
          name: user.email,
          password,
        },
      });
      await user.save();
      return { message: passwordGenerated };
    } catch (e) {
      throw new InternalServerErrorException({ message: serverError });
    }
  }
}
