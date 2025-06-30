import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AllExceptionsFilter } from '@driveapp/core/exceptions';

import { ValidateUserSessionUsecase } from '@/base/driveapp-graphql/login';
import {
  GqlAuthSessionGuard,
  SetRequestCookiesService,
} from '@/components/authentication';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(helmet());

  const reflector = app.get(Reflector);

  app.useGlobalGuards(
    new GqlAuthSessionGuard(
      reflector,
      app.get(SetRequestCookiesService),
      app.get(ValidateUserSessionUsecase),
    ),
  );
  const config = app.get(ConfigService);
  const port = config.get('PORT', 80);
  // app.useGlobalFilters(
  //   // new AllExceptionsFilter(app.get(HttpAdapterHost).httpAdapter, config),
  // );
  await app.listen(port);
  const logger = new Logger('bootstrap');
  logger.log(`Server is running on port ${port}`);
}

bootstrap();
