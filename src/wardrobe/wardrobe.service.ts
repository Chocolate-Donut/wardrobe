import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wardrobe } from './wardrobe.entity';
import { User } from '../users/user.entity';
import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';
import { UpdateWardrobeItemDto } from './dto/update-wardrobe-item.dto';
import { removeBackground, extractColors } from '../utils/image-processing';
import { detectClothingType } from '../utils/clarifai';  // Импортируем функцию для получения типа через Clarifai

@Injectable()
export class WardrobeService {
  constructor(
    @InjectRepository(Wardrobe)
    private wardrobeRepository: Repository<Wardrobe>,
  ) {}



    // Получение всех уникальных цветов для фильтрации
  async getUniqueColors(user: User): Promise<string[]> {
    const items = await this.wardrobeRepository.find({
      where: { user: { id: user.id } },
    });

    const allColors = items.flatMap(item => item.colors); // Собираем все цвета из гардероба
    const uniqueColors = Array.from(new Set(allColors)); // Убираем дубли

    return uniqueColors;
  }




  // 🔵 1. Загрузка и обработка одежды
  async uploadClothing(filePath: string, dto: CreateWardrobeItemDto, user: User): Promise<Wardrobe> {
    // Убираем фон с изображения
      console.log('File path:', filePath);  // Для отладки
      console.log('DTO:', dto);  // Для отладки
    const imageWithoutBg = await removeBackground(filePath); 

    // Извлекаем цвета с изображения
    const colors = await extractColors(imageWithoutBg); 

    // Получаем тип одежды от Clarifai
    const clothingType = await detectClothingType(imageWithoutBg);

      console.log('Detected Clothing Type:', clothingType);
      console.log('Extracted Colors:', colors);

    // Создаем запись для гардероба
    const wardrobeItem = this.wardrobeRepository.create({
      imageUrl: imageWithoutBg,   // Путь к изображению без фона
      colors:colors || [],              // Цвета, полученные из изображения
      type: clothingType.type || 'Unknown',    // Тип, полученный через Clarifai
      tags: dto.tags || [],                   // Пустой массив тегов
      season: dto.season || '',         // Сезон, если передан
      brand: dto.brand || '',           // Бренд, если передан
      user,                       // Связь с пользователем
    });

    return await this.wardrobeRepository.save(wardrobeItem); // Сохраняем вещь в базу данных
  }

  // 🔵 2. Получение всех вещей пользователя
  async getUserWardrobe(/* user: any */user: User, type: string, tags: string, color?: string)/* : Promise<Wardrobe[]> */ {
    const queryBuilder = this.wardrobeRepository.createQueryBuilder('wardrobe');

    queryBuilder.where('wardrobe.userId = :userId', { userId: user.id });

    // Фильтрация по типу одежды
    if (type) {
      queryBuilder.andWhere('wardrobe.type LIKE :type', { type: `%${type}%` });
    }

    // Фильтрация по тегам
    if (tags) {
      const tagsArray = tags.split(','); // Пример: 'winter,spring'
      tagsArray.forEach((tag, index) => {
      queryBuilder.andWhere(`wardrobe.tags LIKE :tag${index}`, {
        [`tag${index}`]: `%${tag}%`,
         });
         });
        }
      // Фильтрация по цвету
    if (color) {
      queryBuilder.andWhere('wardrobe.colors LIKE :color', { color: `%${color}%` });
/*   return await this.wardrobeRepository.find({
    where: { user: { id: user.id } }, */
    
  }
  return await queryBuilder.getMany();
}

/*   async getUserWardrobe(user: User): Promise<Wardrobe[]> {
    return await this.wardrobeRepository.find({ where: { user } });
  } */

  // 🔵 3. Изменение типа одежды
  async updateClothingType(id: number, dto: UpdateWardrobeItemDto, user: User): Promise<Wardrobe> {
    const wardrobeItem = await this.wardrobeRepository.findOne({ where: { id, user: { id: user.id } } });
    if (!wardrobeItem) throw new NotFoundException('Одежда не найдена');

    wardrobeItem.type = dto.type || wardrobeItem.type;  // Обновляем тип, если передан
    wardrobeItem.tags = dto.tags || wardrobeItem.tags;  // Обновляем теги
    wardrobeItem.season = dto.season || wardrobeItem.season; // Обновляем сезон
    wardrobeItem.brand = dto.brand || wardrobeItem.brand; // Обновляем бренд

    return await this.wardrobeRepository.save(wardrobeItem);
  }

  // 🔵 4. Удаление вещи
  async deleteClothing(id: number, user: User): Promise<void> {
    const wardrobeItem = await this.wardrobeRepository.findOne({ where: { id, user: { id: user.id } } });
    if (!wardrobeItem) throw new NotFoundException('Одежда не найдена');

    await this.wardrobeRepository.remove(wardrobeItem);
  }


    async processClothing(filePath: string) {
      const imageWithoutBg = await removeBackground(filePath);
      const colors = await extractColors(imageWithoutBg);
      const clothingType = await detectClothingType(imageWithoutBg);

      return {
        imageUrl: imageWithoutBg,
        colors,
        type: clothingType.type,
      };
    }




}



