 import cookieParser from 'cookie-parser';
import helmet from 'helmet';

 import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(helmet());

  const reflector = app.get(Reflector);


  // const config = app.get(ConfigService);
  // const port = config.get('PORT', 80);
  const port = 3000;
  // app.useGlobalFilters(
  //   // new AllExceptionsFilter(app.get(HttpAdapterHost).httpAdapter, config),
  // );
  await app.listen(80);
  const logger = new Logger('bootstrap');
  logger.log(`Server is running on port 80`);
}

bootstrap();
