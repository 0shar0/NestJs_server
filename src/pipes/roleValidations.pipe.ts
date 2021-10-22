import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { invalidValidations } from '../constants/constants';

@Injectable()
export class RoleValidationsPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (
      errors.length === 0 &&
      (value.role === 'SHIPPER' || value.role === 'DRIVER')
    ) {
      return value;
    }
    throw new BadRequestException({ message: invalidValidations });
  }

  private toValidate(metatype) {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
