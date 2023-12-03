import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateTokenMiddleware } from 'common/middlewares/updateToken.middleware';
import { User } from 'database/entities/user.entity';

import { AuthModule } from '../auth/auth.module';
import { CookieModule } from '../cookie/cookie.module';
import { UserRepository } from './repo/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule,
    CookieModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateTokenMiddleware)
      .forRoutes({ path: 'user/:email', method: RequestMethod.GET });
  }
}
