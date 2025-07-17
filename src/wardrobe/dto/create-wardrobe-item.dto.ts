import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateWardrobeItemDto {
  @IsString()
  @IsOptional()
  imageUrl?: string;  // Только изображение

  @IsArray()
  @IsOptional()
  colors?: string[];  // Этот массив будет заполнен автоматически

  @IsString()
  @IsOptional()
  type?: string;  // Этот тип будет получен через Clarifai

  @IsArray()
  @IsOptional()
  tags?: string[];  // Теги можно передавать вручную

  @IsString()
  @IsOptional()
  season?: string;  // Сезон (необязательно)

  @IsString()
  @IsOptional()
  brand?: string;  // Бренд (необязательно)
}
