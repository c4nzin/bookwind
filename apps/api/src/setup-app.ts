import { ENV, Config } from '@common/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import expressSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from './core/exceptions/http-exception.filter';

export async function setupApp(app: NestExpressApplication): Promise<void> {
  const config = app.get<Config>(ENV);

  app.enableCors({
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(expressSanitize());
  app.use(compression());
  app.use(helmet());

  app.setGlobalPrefix(config.GLOBAL_PREFIX);
}
