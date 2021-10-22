import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { noChange } from '../constants/constants';
import { EnumStatus } from '../constants/enums';

export class AbleToChangeLoadGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { load } = context.switchToHttp().getRequest();
    if (load.status === EnumStatus.NEW) {
      return true;
    }
    throw new BadRequestException({ message: noChange });
  }
}
