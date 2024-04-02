import { ENV, Config } from '@common/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import expressSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import helmet from 'helmet';
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from './core/exceptions/http-exception.filter';
import MongoConnect from 'connect-mongo';
import passport from 'passport';

export async function setupApp(app: NestExpressApplication): Promise<void> {
  const config = app.get<Config>(ENV);

  const maxAgeAsTime = 24 * 60 * 60 * 1000;

  app.enableCors({
    credentials: true,
  });

  app.use(
    session({
      name: 'sessionId',
      secret: config.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: maxAgeAsTime,
      },
      store: MongoConnect.create({
        mongoUrl: config.DB_URI,
        stringify: false,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(expressSanitize());
  app.use(compression());
  app.use(helmet());

  app.setGlobalPrefix(config.GLOBAL_PREFIX);

  //Need to add nestjs pino to solve this problem i guess
  // if (!config.isTest) {
  //   const logger = app.get<Logger>(Logger);
  //   app.useGlobalInterceptors(new LoggingInterceptor(logger));
  //   app.setGlobalPrefix(config.GLOBAL_PREFIX);
  // }
}
