import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { EnumStatus } from '../../constants/enums';
import { notNewLoad } from '../../constants/constants';

export class IsLoadNewMiddleware implements NestMiddleware {
  use(req, res, next) {
    if (req.load.status !== EnumStatus.NEW) {
      throw new BadRequestException({ message: notNewLoad });
    }
    next();
  }
}
