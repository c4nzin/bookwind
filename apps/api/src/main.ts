import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config, ENV } from '@modules/config';
import { setupApp } from './setup-app';
import { setupSwagger } from './setup-swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const config = app.get<Config>(ENV);

  setupApp(app);
  setupSwagger(app);

  await app.listen(config.PORT);
}
bootstrap();
