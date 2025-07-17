import { Module } from '@nestjs/common';
import { Wardrobe } from './wardrobe.entity';
import { WardrobeController } from './wardrobe.controller';
import { WardrobeService } from './wardrobe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutfitsModule } from '../outfits/outfits.module';
import { AuthModule } from '../auth/auth.module'; // <-- Импортируем AuthModule
import { ConfigModule } from '@nestjs/config'; // Добавляем импорт
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Module({
  imports: [TypeOrmModule.forFeature([Wardrobe]), ConfigModule, OutfitsModule, AuthModule, MulterModule.register({
    storage: diskStorage({
      destination: './uploads/wardrobe',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Расширение файла
        const filename = `wardrobe_${Date.now()}${ext}`; // Читаемое название
        cb(null, filename);
      },
    }),
  }),],
  controllers: [WardrobeController],
  providers: [WardrobeService],
})
export class WardrobeModule {}

