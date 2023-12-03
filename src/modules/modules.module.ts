import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CookieModule } from './cookie/cookie.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, CookieModule],
})
export class ModulesModule {}
