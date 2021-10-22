import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '../../schemas/user.schema';
import { IsPasswordCorrectMiddleware } from '../../middleware/usersMiddleware/isPasswordCorrect.middleware';
import { IsUserRegisteredMiddleware } from '../../middleware/usersMiddleware/isUserRegistered.middleware';
import { IsUserExistMiddleware } from '../../middleware/usersMiddleware/isUserExist.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { resolve } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        service: process.env.MAIL_SERVICE,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      template: {
        dir: resolve(__dirname, '../../templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(IsUserExistMiddleware)
      .forRoutes({ path: '/api/auth/register', method: RequestMethod.POST })
      .apply(IsUserRegisteredMiddleware, IsPasswordCorrectMiddleware)
      .forRoutes({ path: '/api/auth/login', method: RequestMethod.POST });
  }
}
