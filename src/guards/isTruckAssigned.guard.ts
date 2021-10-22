import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { truckAlreadyAssigned } from '../constants/constants';

export class IsTruckAssignedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { truck } = context.switchToHttp().getRequest();
    if (!truck.assigned_to) {
      return true;
    }
    throw new BadRequestException({ message: truckAlreadyAssigned });
  }
}
