import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../../dto/user.dto';
import { ValidationPipe } from '../../pipes/validations.pipe';
import { RoleValidationsPipe } from '../../pipes/roleValidations.pipe';
import { UserInterceptor } from '../../interceptors/user.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new RoleValidationsPipe())
  register(@Body() { email, password, role }: UserDto) {
    return this.authService.register(email, password, role);
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  login(@Body() { email }: UserDto) {
    return this.authService.login(email);
  }
  @Post('forgot_password')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(UserInterceptor)
  sendMail(@Req() { user }) {
    return this.authService.sendMail(user);
  }
}
