import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LoadController } from './load.controller';
import { LoadService } from './load.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Load, LoadSchema } from '../../schemas/load.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { IsLoadExistMiddleware } from '../../middleware/loadMiddleware/IsLoadExist.middleware';
import { Truck, TruckSchema } from '../../schemas/truck.schema';
import { IsLoadNewMiddleware } from '../../middleware/loadMiddleware/IsLoadNew.middleware';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Load.name, schema: LoadSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Truck.name, schema: TruckSchema }]),
  ],
  controllers: [LoadController],
  providers: [LoadService],
})
export class LoadModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(IsLoadExistMiddleware)
      .forRoutes(
        { path: '/api/loads/:id', method: RequestMethod.ALL },
        { path: '/api/loads/:id/post', method: RequestMethod.ALL },
        {
          path: '/api/loads/:id/shipping_info',
          method: RequestMethod.ALL,
        },
      )
      .apply(IsLoadNewMiddleware)
      .forRoutes({ path: '/api/loads/:id/post', method: RequestMethod.POST });
  }
}
