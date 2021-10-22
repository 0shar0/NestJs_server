import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  maxPasswordLength,
  minPasswordLength,
  notEmail,
  notPassword,
  notString,
} from '../constants/constants';

export class UserDto {
  @IsString({ message: notString })
  @IsEmail({}, { message: notEmail })
  @IsNotEmpty()
  readonly email: string;
  @IsString({ message: notString })
  @Length(minPasswordLength, maxPasswordLength, { message: notPassword })
  readonly password: string;
  @IsString({ message: notString })
  @IsOptional()
  readonly role: string;
}
