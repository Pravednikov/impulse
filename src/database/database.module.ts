import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeormConfig } from './typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeormConfig())],
})
export class DatabaseModule {}
