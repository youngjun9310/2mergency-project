import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/swagger/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(methodOverride('_method'))
  setupSwagger(app);
  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir([join(__dirname, '..', 'views'),
  join(__dirname, '..', 'views', 'groups_h'),
  join(__dirname, '..', 'views', 'group-members_h'),
  join(__dirname, '..', 'views', 'users_h'),
  join(__dirname, '..', 'views', 'schedules_h'),
  join(__dirname, '..', 'views', 'records_h')]);

  await app.listen(3000);
  Logger.log('Swagger 주소 : http://localhost:3000/api');
  Logger.log('서버 주소 : https://2mergency.com/');
}
bootstrap();
