import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { LoadService } from './load.service';
import { RoleGuard } from '../../guards/role.guard';
import { AuthGuard } from '../../guards/authGuard/auth.guard';
import { Roles } from '../../decorators/role.decorator';
import { LoadDto } from '../../dto/load.dto';
import { ValidationWithDimensionPipe } from '../../pipes/validationWithDimension.pipe';
import { EnumRole } from '../../constants/enums';
import { BelongLoadToThisUserGuard } from '../../guards/belongLoadToThisUser.guard';
import { TruckInterceptor } from '../../interceptors/truck.interceptor';
import { LoadInterceptor } from '../../interceptors/load.interceptor';
import { AbleToChangeLoadGuard } from '../../guards/ableToChangeLoad.guard';

@Controller('loads')
export class LoadController {
  constructor(private readonly loadService: LoadService) {}
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.SHIPPER, EnumRole.DRIVER)
  @Get()
  getById(@Req() { user }, @Query() { status, limit, offset }) {
    if (user.role === EnumRole.DRIVER) {
      return this.loadService.getDriversList(user.id, status, limit, offset);
    }
    if (user.role === EnumRole.SHIPPER) {
      return this.loadService.getShipperList(user.id, status, limit, offset);
    }
  }

  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.SHIPPER)
  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationWithDimensionPipe())
  addNew(@Body() load: LoadDto, @Req() req) {
    return this.loadService.addNew(load, req.user.id);
  }
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.DRIVER)
  @Get('active')
  @UseInterceptors(LoadInterceptor)
  getActive(@Req() { load }) {
    return this.loadService.getActive(load);
  }
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.DRIVER)
  @Patch('active/state')
  @UseInterceptors(TruckInterceptor, LoadInterceptor)
  updateActive(@Req() { truck, load }) {
    return this.loadService.updateActive(truck, load);
  }

  @UseGuards(BelongLoadToThisUserGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  getLoadById(@Req() { load }) {
    return this.loadService.getLoadById(load);
  }
  @UseGuards(AbleToChangeLoadGuard)
  @UseGuards(BelongLoadToThisUserGuard)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.SHIPPER)
  @Put(':id')
  updateLoadById(@Req() { load }, @Body() body) {
    return this.loadService.updateLoadById(load, body);
  }
  @UseGuards(AbleToChangeLoadGuard)
  @UseGuards(BelongLoadToThisUserGuard)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.SHIPPER)
  @Delete(':id')
  deleteLoadById(@Req() { load }) {
    return this.loadService.deleteById(load._id);
  }
  @UseGuards(BelongLoadToThisUserGuard)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.SHIPPER)
  @Post(':id/post')
  @HttpCode(HttpStatus.OK)
  postLoadById(@Req() { load }) {
    return this.loadService.postLoadById(load);
  }
  @UseGuards(BelongLoadToThisUserGuard)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Roles(EnumRole.SHIPPER)
  @Get(':id/shipping_info')
  getFullInfo(@Req() { load }) {
    return this.loadService.getFullInfo(load);
  }
}
