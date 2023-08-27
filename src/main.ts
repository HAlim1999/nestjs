import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api')


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  )

  /** Inicializamos sesiones para controlar peticiones internas */
  app.use(
    session({
      secret: process.env.SECRET_SESSION,
      resave: false,
      saveUninitialized: true,
    }),
  );
  app.enableCors();
  await app.listen(configService.get(`PORT`));
}
bootstrap();
