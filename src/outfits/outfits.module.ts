import { Module } from '@nestjs/common';
import { OutfitsService } from './outfits.service';
import { OutfitsController } from './outfits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outfit } from './outfit.entity/outfit.entity';
import { AuthModule } from '../auth/auth.module'; // Импортируем AuthModule
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { Favorite } from './favorite.entity';
import { User } from '../users/user.entity';
import { FavoritesController } from '../favorites/favorites.controller';
import { FavoritesService } from '../favorites/favorites.service';
import { ScreenshotModule } from '../screenshot/screenshot.module'; // 👈 добавить

@Module({
  imports: [
    ConfigModule, 
    TypeOrmModule.forFeature([Outfit, Favorite]), // Объединяем в один вызов
    AuthModule, 
    ScreenshotModule,
  ],
  controllers: [OutfitsController],
  providers: [OutfitsService], // Удаляем JwtAuthGuard
  exports: [OutfitsService, TypeOrmModule], // Экспортируем, чтобы `FavoritesModule` мог использовать `OutfitRepository`
})
export class OutfitsModule {}

