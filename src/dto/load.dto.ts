import {
  IsNotEmpty,
  IsNotEmptyObject, IsNumber,
  IsNumberString,
  IsObject,
  IsString,
  Max,
} from 'class-validator';
import {
  maxLargeStraightHeight,
  maxLargeStraightLength,
  maxLargeStraightPayload,
  maxLargeStraightWidth,
  tooLarge,
} from '../constants/constants';

export class Dimensions {
  @IsNumber()
  @Max(maxLargeStraightWidth, { message: tooLarge })
  width: number;
  @IsNumber()
  @Max(maxLargeStraightLength, { message: tooLarge })
  length: number;
  @IsNumber()
  @Max(maxLargeStraightHeight, { message: tooLarge })
  height: number;
}

export class LoadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Max(maxLargeStraightPayload, { message: tooLarge })
  payload: number;

  @IsString()
  @IsNotEmpty()
  pickup_address: string;

  @IsString()
  @IsNotEmpty()
  delivery_address: string;

  @IsObject()
  @IsNotEmptyObject()
  dimensions: Dimensions;
}
