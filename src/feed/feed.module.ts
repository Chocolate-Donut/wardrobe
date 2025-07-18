import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { OutfitsModule } from '../outfits/outfits.module';
import { AuthModule } from '../auth/auth.module'; // ✅ Добавляем AuthModule
import { ConfigModule } from '@nestjs/config'; // ✅ Добавляем ConfigModule
import { WeatherModule } from '../weather/weather.module'; // ✅ Добавляем WeatherModule
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [OutfitsModule, ConfigModule,AuthModule, WeatherModule,  UsersModule, ], // Подключаем OutfitsModule, чтобы работать с образами
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
