import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { jwtConfig } from '../../../config';
import { CookieModule } from '../cookie/cookie.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UserModule, CookieModule, JwtModule.registerAsync(jwtConfig())],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
