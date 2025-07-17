import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'; // если нужны шаблоны (не обязательно)

@Module({
  imports: [TypeOrmModule.forFeature([User]),MailerModule.forRoot({
    transport: {
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525, // любой из предложенных (2525 стабильно работает)
      auth: {
        user: '4ad532c5aa91e6',
        pass: 'f1c6c42b1e7a2b',
      },
    },
    defaults: {
      from: '"Wardrobe App" <no-reply@wardrobe.com>',
    },
  })
  ,], // Подключаем сущность User
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule], // Экспортируем UsersService, чтобы использовать в AuthModule
})
export class UsersModule {}
