import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './calendar.entity';
import { Outfit } from '../outfits/outfit.entity/outfit.entity';
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module'; // Добавляем импорт
import { ConfigModule } from '@nestjs/config'; // ✅ Добавляем ConfigModule
import { WeatherModule } from '../weather/weather.module'; // Импортируем WeatherModule

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, Outfit, User,]),AuthModule, 
    ConfigModule,
    WeatherModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
