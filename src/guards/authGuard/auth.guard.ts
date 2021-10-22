import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { unAuth } from '../../constants/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      let token;
      const authHeader = req.headers.authorization;
      if (authHeader.split(' ').length > 1) {
        token = authHeader.split(' ').filter((e) => e !== '')[1];
      } else {
        token = authHeader;
      }
      req.user = this.jwtService.verify(token);
      return true;
    } catch (e) {
      throw new BadRequestException({ message: unAuth });
    }
  }
}
