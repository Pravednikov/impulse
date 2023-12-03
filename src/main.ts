import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set up prefixes and versioning
  app.setGlobalPrefix('/api');
  app.enableVersioning();

  app.use(compression());
  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());

  // Get access to config port
  const configService = app.get(ConfigService);
  const port = configService.get<number>('env.port');

  await app.listen(port, () => console.log(`Server started on port = ${port}`));
}

bootstrap();
