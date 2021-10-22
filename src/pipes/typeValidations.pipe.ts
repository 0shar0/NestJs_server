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
export class TypeValidationsPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (
      errors.length === 0 &&
      (value.type === 'SPRINTER' ||
        value.type === 'SMALL STRAIGHT' ||
        value.type === 'LARGE STRAIGHT')
    ) {
      return value;
    }
    throw new BadRequestException({ message: invalidValidations });
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
