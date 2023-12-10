import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateTokenMiddleware } from 'common/middlewares/updateToken.middleware';
import { AuthModule } from 'modules/auth/auth.module';
import { CookieModule } from 'modules/cookie/cookie.module';
import { UserModule } from 'modules/user/user.module';

import { throttleConfig, typeormConfig } from '../config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CookieModule,
    TypeOrmModule.forRootAsync(typeormConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync(throttleConfig()),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(UpdateTokenMiddleware)
      .exclude(
        { path: 'auth/signup', method: RequestMethod.POST },
        {
          path: 'auth/signin',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
  }
}
