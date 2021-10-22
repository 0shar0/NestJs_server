import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { LoadModule } from './modules/load/load.module';
import { TruckModule } from './modules/truck/truck.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    RouterModule.register([
      {
        path: '/api',
        module: AuthModule,
      },
      {
        path: '/api',
        module: UserModule,
      },
      {
        path: '/api',
        module: TruckModule,
      },
      {
        path: '/api',
        module: LoadModule,
      },
    ]),
    MorganModule,
    AuthModule,
    UserModule,
    LoadModule,
    TruckModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
  ],
})
export class AppModule {}
