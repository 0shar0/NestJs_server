import { IsString } from 'class-validator';
import { EnumTruckType } from '../constants/enums';

export class TruckTypeDto {
  @IsString()
  type:
    | EnumTruckType.SPRINTER
    | EnumTruckType.SMALL_STRAIGHT
    | EnumTruckType.LARGE_STRAIGHT;
}
