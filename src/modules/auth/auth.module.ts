import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UpdateTokenMiddleware } from 'common/middlewares/updateToken.middleware';

import env from '../../utils/env';
import { CookieModule } from '../cookie/cookie.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    CookieModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(env)],
      useFactory: (config: ConfigType<typeof env>): JwtModuleOptions => {
        return {
          global: true,
          secret: config.secret,
        } as JwtModuleOptions;
      },
      inject: [env.KEY],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateTokenMiddleware)
      .forRoutes({ path: 'auth/signout', method: RequestMethod.POST });
  }
}
