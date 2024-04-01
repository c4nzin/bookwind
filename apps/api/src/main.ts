import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config, ENV } from '@common/config';
import { setupApp } from './setup-app';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<Config>(ENV);

  await setupApp(app);
  setupSwagger(app);

  await app.listen(config.PORT);
}
bootstrap();
