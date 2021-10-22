import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TruckController } from './truck.controller';
import { TruckService } from './truck.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { Truck, TruckSchema } from '../../schemas/truck.schema';
import { IsTruckExistMiddleware } from '../../middleware/truckMiddleware/isTruckExist.middleware';
import { Load, LoadSchema } from '../../schemas/load.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Load.name, schema: LoadSchema }]),
    MongooseModule.forFeature([{ name: Truck.name, schema: TruckSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TruckController],
  providers: [TruckService],
})
export class TruckModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(IsTruckExistMiddleware)
      .forRoutes(
        { path: '/api/trucks/:id', method: RequestMethod.ALL },
        { path: '/api/trucks/:id/assign', method: RequestMethod.ALL },
      );
  }
}
