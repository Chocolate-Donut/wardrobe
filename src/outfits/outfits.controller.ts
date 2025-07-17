
//outfit controller
import { Controller, Get, Post, Delete, Param, Body, UseGuards, Query, Req, Patch, UseInterceptors, UploadedFile, BadRequestException  } from '@nestjs/common';
import { OutfitsService } from './outfits.service';
import { Outfit } from './outfit.entity/outfit.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express'; // Добавляем правильный импорт
import { Express } from 'express'; 
import * as multer from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CreateConstructedLookDto } from './dto/create-constructed-look.dto';



@Controller('outfits')
export class OutfitsController {
  constructor(private readonly outfitsService: OutfitsService) {}

      @Get()
  async getAllPublicOutfits() {
    return this.outfitsService.getFilteredOutfits();
  }

/*   // Получить первые 20 образов (без авторизации)
  @Get('public')
  getPublicOutfits(): Promise<Outfit[]> {
    return this.outfitsService.getPublicOutfits();
  } */

/*   //получить отфильтрованные образы
  @Get()
  async getFilteredOutfits(
    @Query('season') season?: string,
    @Query('tags') tags?: string,
    @Query('trend') trend?: string,
  ) {
    console.log('🔥🔥🔥 Контроллер вызван!'); // ТЕСТОВЫЙ ЛОГ
    console.log('🔥 Контроллер получил параметры:', { season, tags, trend }); // ЛОГ ДЛЯ ПРОВЕРКИ

    return this.outfitsService.getFilteredOutfits(season, tags, trend);
  } */


//образы пользователя
  @UseGuards(JwtAuthGuard)
  @Get('my-outfits')
  async getMyOutfits(@Req() req: Request & { user?: any }) { 
    if (!req.user) {
      throw new Error('Пользователь не найден в запросе');
    }
    
    console.log('req.user:', req.user);
    
    const userId = req.user.sub; // Используем sub, если id нет
    
    return this.outfitsService.getUserOutfits(userId);
  }

  /* //Поиск
  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchOutfits(@Query('query') query: string) {
    console.log(`🔥 Запрос на поиск: ${query}`);
    return this.outfitsService.searchOutfits(query);
  }
  // Эндпоинт для поиска образов по цветам
  @UseGuards(JwtAuthGuard)
  @Get('search-by-color')
  async searchByColor(@Query('palette') palette: string) {
    let parsedPalette: string[];
  
    try {
      // Пробуем парсить строку, если она передана как строка JSON
      parsedPalette = JSON.parse(palette);
    } catch (error) {
      throw new Error('Невозможно распарсить палитру. Убедитесь, что передаете массив.');
    }
  
    // Проверка на то, что это действительно массив
    if (!Array.isArray(parsedPalette)) {
      throw new Error('Палитра должна быть массивом');
    }
  
    if (parsedPalette.length === 0) {
      throw new Error('Палитра цветов не может быть пустой!');
    }
  
    return this.outfitsService.searchOutfitsByColor(parsedPalette);
  }
   */



  // загрузка файлов и добавление образа
  // загрузка файлов и добавление образа
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      }
    })
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; tags: string[]; season: string; trend: string },
    @GetUser() user: User // <-- добавили
  ) {
    console.log('File uploaded:', file);

    // Убедимся, что папка существует
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir);
    }

    const filePath = join(uploadsDir, file.originalname);
    console.log('File path for color extraction:', filePath);

    try {
      const colors = await this.outfitsService.extractColors(filePath);
      console.log('Extracted colors:', colors);

      await this.outfitsService.createOutfit({
        imageUrl: filePath,
        colors: JSON.stringify(colors),
        title: body.title, // Данные от пользователя
        tags: body.tags,
        season: body.season,
        trend: body.trend,
        user: user,
      });

      return { message: 'File uploaded and colors extracted successfully', file, colors,  processedImagePath: filePath, };
    } catch (error) {
      console.error('Error during file upload and color extraction:', error);
      return { message: 'Error during file upload and color extraction', error };
    }
  }




  /* @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      }
    })
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; tags: string[]; season: string; trend: string },
    @GetUser() user: User // <-- добавили
  ) {
    console.log('File uploaded:', file);

    // Убедимся, что папка существует
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir);
    }

    const filePath = join(uploadsDir, file.originalname);
    console.log('File path for color extraction:', filePath);

    try {
      const colors = await this.outfitsService.extractColors(filePath);
      console.log('Extracted colors:', colors);

      await this.outfitsService.createOutfit({
        imageUrl: filePath,
        colors: JSON.stringify(colors),
        title: body.title, // Данные от пользователя
        tags: body.tags,
        season: body.season,
        trend: body.trend,
        user: user,
      });

      return { message: 'File uploaded and colors extracted successfully', file, colors,  processedImagePath: filePath, };
    } catch (error) {
      console.error('Error during file upload and color extraction:', error);
      return { message: 'Error during file upload and color extraction', error };
    }
  } */

/* 2 @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      }
    })
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('File uploaded:', file);

    // Убедимся, что папка существует
    const uploadsDir = join(__dirname, 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir);
    }

    const filePath = join(process.cwd(), 'uploads', file.originalname);
    console.log('File path for color extraction:', filePath);

    try {
      const colors = await this.outfitsService.extractColors(filePath);
      console.log('Extracted colors:', colors);

      await this.outfitsService.createOutfit({
        imageUrl: filePath,
        colors: JSON.stringify(colors),
        title: 'New Outfit',
        tags: ['summer', 'casual'],
        season: 'summer',
        trend: 'casual',
      });

      return { message: 'File uploaded and colors extracted successfully', file, colors };
    } catch (error) {
      console.error('Error during file upload and color extraction:', error);
      return { message: 'Error during file upload and color extraction', error };
    }
  } */
/* 1 @UseGuards(JwtAuthGuard)
@Post('upload')
@UseInterceptors(FileInterceptor('image', {
  storage: multer.diskStorage({
    destination: './uploads',  // Папка для сохранения
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    }
  })
}))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  console.log('File uploaded:', file);

  // Путь к загруженному файлу
  const filePath = join(__dirname, 'uploads', file.originalname);

  // Извлечение цветов
  try {
    const colors = await this.outfitsService.extractColors(filePath);
    console.log('Extracted colors:', colors);

    // Добавляем новые данные в базу данных
    await this.outfitsService.createOutfit({
      imageUrl: filePath,  // Используем путь к изображению
      colors: JSON.stringify(colors),  // Сохраняем цвета как строку JSON
      title: 'New Outfit',  // Примерное название
      tags: ['summer', 'casual'],  // Примерные теги
      season: 'summer',  // Примерный сезон
      trend: 'casual',  // Примерный тренд
    });

    return { message: 'File uploaded and colors extracted successfully', file, colors };
  } catch (error) {
    console.error('Error during file upload and color extraction:', error);
    return { message: 'Error during file upload and color extraction', error };
  }
} */

/*   // Добавить новый образ
  @UseGuards(JwtAuthGuard)
  @Post()
  createOutfit(@GetUser() user: User, @Body() outfitData: Partial<Outfit>): Promise<Outfit> {
    return this.outfitsService.createOutfit({ ...outfitData, user });
  } */

  // Удалить образ
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOutfit(@GetUser() user: User, @Param('id') id: number): Promise<void> {
    return this.outfitsService.deleteOutfit(user, id);
  }

/* 
  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  async addToFavorites(@GetUser() user: User, @Param('id') outfitId: number) {
    if (!user.id) {
      throw new Error('❌ Ошибка: user.id не найден! Проверь JWT токен.');
    }
    console.log('✅ User:', user);
    return this.outfitsService.addToFavorites(user, outfitId);
  }
    
  //удаление из избранного
  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorite')  // <-- используй именно этот путь
  removeFromFavorites(@GetUser() user: User, @Param('id') id: number) {
    return this.outfitsService.removeFromFavorites(user, id);
  }

  //Показать все избранные образы
  @UseGuards(JwtAuthGuard)
  @Get('my-favorites')
  async getUserFavorites(@GetUser() user: User) {
    return this.outfitsService.getUserFavorites(user);
  } */


  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchOutfits(@Query('query') query: string) {
    return this.outfitsService.searchOutfits(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('search-by-color')
  async searchByColor(@Body('palette') palette: string[]) {
    return this.outfitsService.searchOutfitsByColor(palette);
  }



/*   @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOutfitById(@Param('id') outfitId: number) {
    return this.outfitsService.getOutfitById(outfitId);
  } */
  @Get(':id')
async getOutfitById(@Param('id') outfitId: string) {
  const id = parseInt(outfitId, 10);
  if (isNaN(id)) {
    throw new BadRequestException('❌ Неверный формат ID');
  }
  return this.outfitsService.getOutfitById(id);
}

  

// загрузка файлов и добавление образа
  /* @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      }
    })
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; tags: string[]; season: string; trend: string },
    @GetUser() user: User // <-- добавили
  ) {
    console.log('File uploaded:', file);

    // Убедимся, что папка существует
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir);
    }

    const filePath = join(uploadsDir, file.originalname);
    console.log('File path for color extraction:', filePath);

    try {
      const colors = await this.outfitsService.extractColors(filePath);
      console.log('Extracted colors:', colors);

      await this.outfitsService.createOutfit({
        imageUrl: filePath,
        colors: JSON.stringify(colors),
        title: body.title, // Данные от пользователя
        tags: body.tags,
        season: body.season,
        trend: body.trend,
        user: user,
      });

      return { message: 'File uploaded and colors extracted successfully', file, colors,  processedImagePath: filePath, };
    } catch (error) {
      console.error('Error during file upload and color extraction:', error);
      return { message: 'Error during file upload and color extraction', error };
    }
  } */





//constructor
// outfits.controller.ts
@Post()
@UseGuards(JwtAuthGuard)
createFromConstructor(
  @Body() dto: CreateConstructedLookDto,
  @GetUser() user: User
) {
  return this.outfitsService.createFromConstructor(dto, user);
}






/* @UseGuards(JwtAuthGuard)
@Post('constructor') // <--- вот этот путь
@UseInterceptors(FileInterceptor('image', {
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
}))
async uploadConstructorLook(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any,
  @GetUser() user: User
) {
  if (!file) throw new BadRequestException('Файл отсутствует');

  const filePath = join(process.cwd(), 'uploads', file.filename);
  return this.outfitsService.createFromConstructorUpload(filePath, body, user);
} */
/* @Post('constructor')
@UseInterceptors(FileInterceptor('image'))
async createOutfit(
  @Body() dto: CreateConstructedLookDto,
  @Req() req: Request,
) {
  const outfit = new Outfit();
  outfit.title = dto.title;
  outfit.items = JSON.stringify(dto.items); // хранится как string
  outfit.season = dto.season;
  outfit.trend = dto.trend;
  outfit.isPrivate = dto.isPrivate;
  outfit.tags = dto.tags;

  const filename = `outfit_${Date.now()}.png`;
  const imageUrl = await this.screenshotService.generateOutfitImage(dto.items, filename);

  outfit.imageUrl = imageUrl;
  outfit.user = req.user;

  return this.outfitRepo.save(outfit);
} */
/* @Post('constructor')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('image')) // можно убрать если не нужен
async createConstructorLook(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any,
  @GetUser() user: User,
) {
  const dto: CreateConstructedLookDto = {
    title: body.title,
    tags: JSON.parse(body.tags),
    season: body.season,
    trend: body.trend,
    isPrivate: body.isPrivate === 'true',
    items: JSON.parse(body.items),
  };

  return this.outfitsService.createFromConstructorWithScreenshot(dto, user);
} */


@Post('constructor/json')
@UseGuards(JwtAuthGuard)
async createLookFromJson(
  @Body() dto: CreateConstructedLookDto,
  @GetUser() user: User,
) {
  return this.outfitsService.createFromConstructorWithScreenshot(dto, user);
}






}




