import { IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateConstructedLookDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  season: string;

  @IsString()
  trend: string;

  @IsBoolean()
  isPrivate: boolean;

  @IsArray()
  items: any[]; 

  canvasWidth?: number;
  canvasHeight?: number;

}
