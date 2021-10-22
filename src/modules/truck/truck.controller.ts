import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TruckService } from './truck.service';
import { AuthGuard } from '../../guards/authGuard/auth.guard';
import { Roles } from '../../decorators/role.decorator';
import { RoleGuard } from '../../guards/role.guard';
import { TruckTypeDto } from '../../dto/truckType.dto';
import { TypeValidationsPipe } from '../../pipes/typeValidations.pipe';
import { EnumRole } from '../../constants/enums';
import { IsTruckAssignedGuard } from '../../guards/isTruckAssigned.guard';
import { IsUserHasActiveLoadsGuard } from '../../guards/isUserHasActiveLoads.guard';

@Controller('trucks')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.DRIVER)
  @Get()
  getAll(@Req() req) {
    return this.truckService.getAllTrucks(req.user.id);
  }
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.DRIVER)
  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new TypeValidationsPipe())
  addNew(@Body() { type }: TruckTypeDto, @Req() req) {
    return this.truckService.addNew(type, req.user.id);
  }
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.DRIVER)
  @Get(':id')
  getById(@Req() { truck }) {
    return this.truckService.getOneById(truck);
  }
  @UseGuards(IsTruckAssignedGuard)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.DRIVER)
  @Put(':id')
  putById(@Req() { truck }, @Body() body) {
    return this.truckService.updateById(truck, body);
  }
  @UseGuards(IsTruckAssignedGuard)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.DRIVER)
  @Delete(':id')
  deleteById(@Req() { truck }) {
    return this.truckService.deleteById(truck._id);
  }
  @UseGuards(IsTruckAssignedGuard)
  @UseGuards(IsUserHasActiveLoadsGuard)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.DRIVER)
  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  assign(@Req() { user, truck }) {
    return this.truckService.assign(truck, user.id);
  }
}
