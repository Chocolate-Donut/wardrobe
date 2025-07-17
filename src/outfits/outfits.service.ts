//outfit service
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Outfit } from './outfit.entity/outfit.entity';
import { User } from '../users/user.entity';
import { Favorite } from './favorite.entity';
import { BadRequestException } from '@nestjs/common';
import { ILike } from 'typeorm';
import getImageColors from 'get-image-colors';
import * as ColorThief from 'color-thief-node';
//import axios from 'axios';
import sharp from 'sharp';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
//import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // сверху файла

import { hexToRgb, colorDistance } from './color-utils'; // helper функции (ниже)

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const execPromise = promisify(exec);
import { removeBackground, extractColors } from '../utils/image-processing';
import { CreateConstructedLookDto } from './dto/create-constructed-look.dto';
import { ScreenshotService } from '../screenshot/screenshot.service'; // обязательно подключи




/* async function removeBackground(filePath: string, outputPath: string) {
  // Проверим, существует ли файл
  if (!fs.existsSync(filePath)) {
    throw new Error('Файл не найден');
  }

  try {
    // Создаем FormData объект
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(filePath));

    // Используем axios для отправки запроса с локальным файлом
    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg', 
      formData, 
      { 
        headers: { 
          'X-Api-Key': 'N17D1T4oVHksNREYizJL1toj',
          ...formData.getHeaders() // Добавляем заголовки форм
        }, 
        responseType: 'stream',
      }
    );

    response.data.pipe(fs.createWriteStream(outputPath)); // Записываем результат
    return outputPath;

  } catch (error) {
    console.error('Ошибка при удалении фона:', error.response?.data || error);
    throw new Error('Ошибка при удалении фона');
  }
} */

@Injectable()
export class OutfitsService {
  constructor(
    @InjectRepository(Outfit)
    private outfitsRepository: Repository<Outfit>,

    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,

    private screenshotService: ScreenshotService,
  ) {}


     /* async removeBackgroundAndSave(filePath: string): Promise<string> {
    const outputPath = path.resolve(process.cwd(), 'uploads', 'output_image.png'); // Абсолютный путь

    try {
        console.log(`Файл для обработки: ${filePath}`);
        console.log(`Файл будет сохранен в: ${outputPath}`);

        // Удаляем старый файл, если он существует
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
            console.log(`Старый файл ${outputPath} удален.`);
        }

        const outputImage = await removeBackground(filePath, outputPath);
        console.log(`Файл успешно сохранён: ${outputImage}`);

        // Ожидание записи файла
        await new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (fs.existsSync(outputPath)) {
                    clearInterval(interval);
                    console.log(`Файл доступен: ${outputPath}`);
                    resolve(null);
                }
            }, 500);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error(`Файл ${outputPath} так и не появился.`));
            }, 5000); // Ждем максимум 5 секунд
        });

        return outputPath;
    } catch (error) {
        console.error(`Ошибка при удалении фона: ${error.message}`);
        throw new Error('Ошибка при удалении фона');
    }
}
 */



  // Извлечение цветов из обработанного изображения

  // Извлечение цветов из обработанного изображения

  /* async extractColors(imageUrl: string): Promise<string[]> {
    try {
        const imageWithoutBg = await removeBackground(imageUrl);
        const colors = await extractColors(imageWithoutBg);


        console.log(`Изображение для извлечения цветов: ${processedImagePath}`);

        // Проверяем, существует ли файл
        if (!fs.existsSync(processedImagePath)) {
            throw new Error(`Файл не найден: ${processedImagePath}`);
        }

        // Ждем, пока файл станет доступен для чтения
        await new Promise((resolve, reject) => {
            let attempts = 0;
            const interval = setInterval(() => {
                if (fs.existsSync(processedImagePath)) {
                    clearInterval(interval);
                    resolve(null);
                }
                attempts++;
                if (attempts > 10) {
                    clearInterval(interval);
                    reject(new Error(`Файл ${processedImagePath} так и не появился.`));
                }
            }, 500);
        });

        const colors = await getImageColors(processedImagePath);
        console.log(`Извлеченные цвета: ${colors.map(c => c.hex())}`);

        return colors.map(color => color.hex());
    } catch (error) {
        console.error('Ошибка при извлечении цветов:', error);
        throw new Error('Ошибка при извлечении цветов');
    }
} */

    async extractColors(imageUrl: string): Promise<string[]> {
  try {
    const imageWithoutBg = await removeBackground(imageUrl); // вырезаем фон
    const colors = await extractColors(imageWithoutBg); // извлекаем цвета
    console.log(`Извлеченные цвета: ${colors}`);
    return colors;
  } catch (error) {
    console.error('Ошибка при извлечении цветов:', error);
    throw new Error('Ошибка при извлечении цветов');
  }
}




  async createOutfit(outfitData: any) {
    // Логика для извлечения цветов
/*     const colors = await this.extractColors(outfitData.imageUrl);
  
    // Создаем новый образ
    const outfit = this.outfitsRepository.create({
      ...outfitData,
      colors,  // Используем массив цветов
      
    }); */
    const imageWithoutBg = await removeBackground(outfitData.imageUrl);
    const colors = await extractColors(imageWithoutBg);

    const outfit = this.outfitsRepository.create({
      ...outfitData,
      imageUrl: imageWithoutBg, // обновлённый путь
      colors,
    });

  
    // Сохраняем образ в базе данных
    return this.outfitsRepository.save(outfit);
  }
  


 
  // Получить первые 20 образов
  async getPublicOutfits(): Promise<Outfit[]> {
    return this.outfitsRepository.find({
      take: 20,
      order: { createdAt: 'DESC' },
    });
  }

  // Получить образы текущего пользователя
  async getUserOutfits(userId: number) {
    return this.outfitsRepository.find({
      where: { user: { id: userId } }, // Теперь проверяем id вместо sub
    });
  }
      
  // Удалить образ (только владелец)
  async deleteOutfit(user: User, id: number): Promise<void> {
    const outfit = await this.outfitsRepository.findOne({ where: { id }, relations: ['user'] });

    if (!outfit) throw new NotFoundException('Образ не найден');
    if (outfit.user.id !== user.id) throw new ForbiddenException('Нет прав на удаление');

    await this.outfitsRepository.remove(outfit);
  }


  // по айди образ
  async getOutfitById(outfitId: number): Promise<Outfit> {
    const outfit = await this.outfitsRepository.findOne({ where: { id: outfitId } });

    if (!outfit) {
        throw new NotFoundException('❌ Образ не найден!');
    }

    return outfit;
}

  
  //фильтрация

  async getFilteredOutfits(season?: string, tags?: string, trend?: string): Promise<Outfit[]> {
    const query = this.outfitsRepository.createQueryBuilder('outfit')
    .where('outfit.isPrivate = :isPrivate', { isPrivate: false });;

  
    if (season) {
      query.andWhere('LOWER(outfit.season) = LOWER(:season)', { season });
    }
  
    if (trend) {
      query.andWhere('LOWER(outfit.trend) = LOWER(:trend)', { trend });
    }
  
    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
  
      query.andWhere(
        tagsArray
          .map((tag, index) => `EXISTS (SELECT 1 FROM json_each(outfit.tags) WHERE LOWER(json_each.value) = LOWER(:tag${index}))`)
          .join(' OR '),
        Object.fromEntries(tagsArray.map((tag, index) => [`tag${index}`, tag])),
      );
    }
  
    console.log('🔥 Фильтрация с параметрами перед SQL:', { season, tags, trend });
    console.log('🔥 Сформированный SQL-запрос:', query.getSql());
  
    const results = await query.getMany();
    console.log('🔥 Результаты после фильтрации:', results);
  
    return results;
  }
  
  
  //поиск
  // по тегам, названию, сезону, трендам
  /* async searchOutfits(query: string): Promise<Outfit[]> {
    if (!query) {
        throw new BadRequestException('❌ Поисковый запрос не должен быть пустым!');
    }

    console.log(`🔥 Ищем по запросу: ${query}`);

    const results = await this.outfitsRepository.find({
        where: [
            { title: ILike(`%${query}%`) },  
            { tags: ILike(`%${query}%`) },   
            { season: ILike(`%${query}%`) }, 
            { trend: ILike(`%${query}%`) }   
        ],
        order: { rating: 'DESC' }  
    });

    console.log(`🔥 Найдено образов: ${results.length}`);
    return results;
} */

    async searchOutfits(query: string): Promise<Outfit[]> {
  if (!query) {
    throw new BadRequestException('❌ Поисковый запрос не должен быть пустым!');
  }

  console.log(`🔥 Ищем по запросу: ${query}`);

  const qb = this.outfitsRepository.createQueryBuilder('outfit');

  qb.where('outfit.isPrivate = false')
    .andWhere(
      `(LOWER(outfit.title) LIKE LOWER(:q) 
      OR LOWER(outfit.season) LIKE LOWER(:q)
      OR LOWER(outfit.trend) LIKE LOWER(:q)
      OR EXISTS (
        SELECT 1 FROM json_each(outfit.tags) 
        WHERE LOWER(json_each.value) LIKE LOWER(:q)
      ))`,
      { q: `%${query}%` }
    )
    .orderBy('outfit.rating', 'DESC');

  const results = await qb.getMany();
  console.log(`🔥 Найдено образов: ${results.length}`);
  return results;
}


async searchOutfitsByColor(palette: string[]): Promise<Outfit[]> {
  const outfits = await this.outfitsRepository.find({
    where: { isPrivate: false },
  });

  const threshold = 50; // допустимая разница RGB
  const matchingOutfits = outfits.filter((outfit) => {
    if (!outfit.colors || !Array.isArray(outfit.colors)) return false;

    return palette.some((targetColor) => {
      const targetRgb = hexToRgb(targetColor);
      return outfit.colors.some((color) => {
        const rgb = hexToRgb(color.trim());
        return colorDistance(targetRgb, rgb) < threshold;
      });
    });
  });

  return matchingOutfits;
}




//constructor

// outfits.service.ts
async createFromConstructor(dto: CreateConstructedLookDto, user: User): Promise<Outfit> {
  const outfit = this.outfitsRepository.create({
    title: dto.title,
    tags: dto.tags,
    season: dto.season,
    trend: dto.trend,
    isPrivate: dto.isPrivate,
    items: dto.items, // сохраняем позиции
    user,
    createdAt: new Date(),
  });

  return await this.outfitsRepository.save(outfit);
}







async createFromConstructorUpload(filePath: string, body: any, user: User): Promise<Outfit> {
  const colors = await extractColors(filePath);

  const outfit = this.outfitsRepository.create({
    title: body.title,
    tags: JSON.parse(body.tags || '[]'),
    season: body.season,
    trend: body.trend,
    isPrivate: body.isPrivate === 'true',
    imageUrl: filePath,
    colors,
    items: JSON.parse(body.items || '[]'),
    user,
    createdAt: new Date(),
  });

  return this.outfitsRepository.save(outfit);
}


async createFromConstructorWithScreenshot(dto: CreateConstructedLookDto, user: User): Promise<Outfit> {
  
      // 1. Используем размеры canvas из DTO или значения по умолчанию
  const canvasWidth = dto.canvasWidth || 1020;
  const canvasHeight = dto.canvasHeight || 760;
  // 1. Генерация HTML
  const html = this.generateHTML(dto.items, 280, 400);





  // 2. Генерация картинки
  const filename = `outfit_${Date.now()}_${uuidv4()}.png`;
  
 
  
const imageUrl = await this.screenshotService.generateOutfitImage(html, filename, 280, 400);

  // 3. Извлечение цветов
  const colors = await extractColors(imageUrl);

  // 4. Сохранение в БД
  const outfit = this.outfitsRepository.create({
    title: dto.title,
    tags: dto.tags,
    season: dto.season,
    trend: dto.trend,
    isPrivate: dto.isPrivate,
    items: dto.items,
    imageUrl,
    colors,
    user,
    createdAt: new Date(),
  });

  return this.outfitsRepository.save(outfit);
}


generateHTML(items: any[], width: number, height: number): string {
  const imageTags = items.map((item) => {
    const src = `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`;
    
    const imgWidth = 100 * (item.scale || 1);
    const imgHeight = imgWidth * (item.aspectRatio || 1);

    return `<img 
      src="${src}" 
      style="
        position: absolute;
        top: ${item.y}px;
        left: ${item.x}px;
        width: ${imgWidth}px;
        height: ${imgHeight}px;
        object-fit: contain;
      "
    />`;
  }).join('');

  return `
    <html>
      <head>
        <style>
          body { margin: 0; background: transparent; }
          .canvas { 
            width: ${width}px; 
            height: ${height}px; 
            position: relative; 
            background: white;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="canvas">
          ${imageTags}
        </div>
      </body>
    </html>
  `;
}





/* generateHTML(items: any[]): string {
  const imageTags = items.map((item) => {
    const src = `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`;
    return `<img 
      src="${src}" 
      style="
        position: absolute;
        top: ${item.y}px;
        left: ${item.x}px;
        transform: scale(${item.scale});
        transform-origin: top left;
      "
    />`;
  }).join('');

  return `
    <html>
      <head>
        <style>
          body { margin: 0; background: transparent; }
          .canvas { width: 400px; height: 500px; position: relative; }
        </style>
      </head>
      <body>
        <div class="canvas">
          ${imageTags}
        </div>
      </body>
    </html>
  `;
} */


  
}
