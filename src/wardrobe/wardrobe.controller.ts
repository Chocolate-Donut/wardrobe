import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Query
  } from '@nestjs/common';
  import { WardrobeService } from './wardrobe.service';
  import { User } from '../users/user.entity';
  import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';
  import { UpdateWardrobeItemDto } from './dto/update-wardrobe-item.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { GetUser } from '../auth/get-user.decorator';
  import { FileInterceptor } from '@nestjs/platform-express';
  
  @Controller('wardrobe')
  @UseGuards(JwtAuthGuard)
  export class WardrobeController {
    constructor(private readonly wardrobeService: WardrobeService) {}
  
    // 🔵 1. Загрузка одежды
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadClothing(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateWardrobeItemDto,
      @GetUser() user: User,
    ) {
      if (!file) {
          throw new BadRequestException('Файл не загружен');
          }
            const completeDto = {
            ...dto,
            colors: dto.colors || [],
            type: dto.type || undefined, // Будет определено сервисом
            imageUrl: dto.imageUrl || undefined // Будет заполнено сервисом
          };

/*         console.log('Received DTO:', dto);
        dto.colors = dto.colors || [];
        dto.type = dto.type || 'Unknown'; */
      return this.wardrobeService.uploadClothing(file.path,completeDto, user);
    }
  
    // 🔵 2. Получение гардероба
    @Get()
    async getUserWardrobe(    
    @GetUser() user: User,
    @Query('type') type: string,
    @Query('tags') tags: string,
    @Query('color') color: string,) {
      return this.wardrobeService.getUserWardrobe(user, type, tags);
    }
  
    // 🔵 3. Обновление типа одежды
    @Put(':id/type')
    async updateClothingType(
      @Param('id') id: number,
      @Body() dto: UpdateWardrobeItemDto,
      @GetUser() user: User,
    ) {
      return this.wardrobeService.updateClothingType(id, dto, user);
    }
  
    // 🔵 4. Удаление одежды
    @Delete(':id')
    async deleteClothing(@Param('id') id: number, @GetUser() user: User) {
      return this.wardrobeService.deleteClothing(id, user);
    }
  
  

    // 🔵 Получение уникальных цветов
    @Get('colors')
    async getColors(@GetUser() user: User) {
      return this.wardrobeService.getUniqueColors(user);
    }

      @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  async processClothing(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Файл не загружен');
    return this.wardrobeService.processClothing(file.path);
  }


  }


