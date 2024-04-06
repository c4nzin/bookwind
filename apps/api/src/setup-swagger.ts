import { Config, ENV } from '@modules/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { name, version, description } from 'package.json';

export function setupSwagger(app: NestExpressApplication) {
  const config = app.get<Config>(ENV);
  const swaggerConfig = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .setDescription(description)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup(
    config.GLOBAL_PREFIX,
    app,
    document,
    swaggerCustomOptions,
  );

  SwaggerModule.setup('/', app, document, swaggerCustomOptions);
}
