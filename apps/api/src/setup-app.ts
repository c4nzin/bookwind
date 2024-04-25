import { ENV, Config } from '@modules/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import expressSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from './core/exceptions/http-exception.filter';
import session from 'express-session';
import passport from 'passport';
import connectMongo from 'connect-mongo';
import { join } from 'path';

export async function setupApp(app: NestExpressApplication): Promise<void> {
  const config = app.get<Config>(ENV);

  app.setBaseViewsDir(join(__dirname + '/infrastructure/mail/templates'));

  app.setViewEngine('ejs');

  app.use(
    session({
      name: 'sessionId',
      secret: config.EXPRESS_SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 2 * 24 * 60 * 60, //2d
      },
      store: connectMongo.create({ mongoUrl: config.DB_URI, stringify: false }),
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
}
