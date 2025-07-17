import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 /*  app.useGlobalPipes(new ValidationPipe()); */

    

  /* app.use('/uploads', express.static(join(process.cwd(), 'uploads'))); */
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
    // Разрешаем CORS для фронтенда (например, если фронт работает на порту 5173)
    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:4173'], // Разрешить запросы с фронтенда
      
      allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
      credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

  




  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


