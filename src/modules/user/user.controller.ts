import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards, UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../guards/authGuard/auth.guard';
import { ChangePasswordGuard } from '../../guards/authGuard/changePassword.guard';
import { UpdatePasswordDto } from '../../dto/updatePassword.dto';
import {ValidationPipe} from "../../pipes/validations.pipe";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  get(@Req() req) {
    return this.userService.getMe(req.user.id);
  }
  @UseGuards(ChangePasswordGuard)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Patch('me/password')
  update(@Body() { newPassword }: UpdatePasswordDto, @Req() req) {
    return this.userService.updatePassword(newPassword, req.user.id);
  }
  @UseGuards(AuthGuard)
  @Delete('me')
  delete(@Req() req) {
    return this.userService.delete(req.user.id);
  }
}
