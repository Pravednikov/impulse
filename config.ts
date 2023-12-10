import 'dotenv/config';

import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import {
  ThrottlerAsyncOptions,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();

export const jwtConfig = (): JwtModuleAsyncOptions => ({
  global: true,
  useFactory(): JwtModuleOptions {
    return {
      global: true,
      secret: configService.get('ACCESS_TOKEN_SECRET'),
    };
  },
});

export const throttleConfig = (): ThrottlerAsyncOptions => ({
  useFactory(): ThrottlerModuleOptions {
    return [
      {
        ttl: configService.get('THROTTLE_TTL'),
        limit: configService.get('THROTTLE_LIMIT'),
      },
    ];
  },
});

export const typeormConfig = (): TypeOrmModuleAsyncOptions => ({
  useFactory(): TypeOrmModuleOptions {
    return {
      ...cfg,
      autoLoadEntities: true,
      synchronize: false,
    };
  },
});

const cfg: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: +configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js'],
};

export default new DataSource(cfg);
