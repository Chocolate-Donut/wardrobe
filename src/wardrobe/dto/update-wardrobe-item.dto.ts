import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateWardrobeItemDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsOptional()
  tags?: string[]; // Теги (необязательно)

  @IsString()
  @IsOptional()
  season?: string; // Сезон (необязательно)

  @IsString()
  @IsOptional()
  brand?: string; // Бренд (необязательно)
}
