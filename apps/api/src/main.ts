import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/exceptions/app.catch';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(HttpAdapterHost).httpAdapter, config),
  );

  app.setGlobalPrefix('/api').enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  const port = config.get('PORT', 80);
  await app.listen(port);
  const logger = new Logger('DriveApp');
  logger.log(`Server is running on port ${port}`);
}

bootstrap();
