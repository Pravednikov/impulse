import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { DatabaseModule } from 'database/database.module';
import env from 'utils/env';

import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ModulesModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(env)],
      useFactory: (config: ConfigType<typeof env>) =>
        [
          {
            ttl: +config.throttleTtl,
            limit: +config.throttleLimit,
          },
        ] as ThrottlerModuleOptions,
      inject: [env.KEY],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
