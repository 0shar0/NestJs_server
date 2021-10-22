import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { invalidValidations } from '../constants/constants';
import { Dimensions } from '../dto/load.dto';

@Injectable()
export class ValidationWithDimensionPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const dimensionsObject = plainToClass(Dimensions, value.dimensions);
    const errors = await validate(object);
    const dimensionsErrors = await validate(dimensionsObject);
    if (errors.length > 0 || dimensionsErrors.length > 0) {
      throw new BadRequestException({ message: invalidValidations });
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
