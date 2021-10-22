import { IsString, Length } from 'class-validator';
import {
  maxPasswordLength,
  minPasswordLength,
  notPassword,
  notString,
} from '../constants/constants';

export class UpdatePasswordDto {
  readonly oldPassword: string;
  @IsString({ message: notString })
  @Length(minPasswordLength, maxPasswordLength, { message: notPassword })
  readonly newPassword: string;
}
