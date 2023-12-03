import 'dotenv/config';

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();

export const typeormConfig = () => {
  return {
    useFactory(): TypeOrmModuleOptions {
      return {
        ...cfg,
        autoLoadEntities: true,
        synchronize: false,
      } as TypeOrmModuleOptions;
    },
  };
};

const cfg: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: +configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
};

export default new DataSource(cfg);
