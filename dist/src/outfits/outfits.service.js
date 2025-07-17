"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutfitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const outfit_entity_1 = require("./outfit.entity/outfit.entity");
const favorite_entity_1 = require("./favorite.entity");
const common_2 = require("@nestjs/common");
const child_process_1 = require("child_process");
const util_1 = require("util");
const uuid_1 = require("uuid");
const color_utils_1 = require("./color-utils");
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const execPromise = (0, util_1.promisify)(child_process_1.exec);
const image_processing_1 = require("../utils/image-processing");
const screenshot_service_1 = require("../screenshot/screenshot.service");
let OutfitsService = class OutfitsService {
    constructor(outfitsRepository, favoritesRepository, screenshotService) {
        this.outfitsRepository = outfitsRepository;
        this.favoritesRepository = favoritesRepository;
        this.screenshotService = screenshotService;
    }
    async extractColors(imageUrl) {
        try {
            const imageWithoutBg = await (0, image_processing_1.removeBackground)(imageUrl);
            const colors = await (0, image_processing_1.extractColors)(imageWithoutBg);
            console.log(`Извлеченные цвета: ${colors}`);
            return colors;
        }
        catch (error) {
            console.error('Ошибка при извлечении цветов:', error);
            throw new Error('Ошибка при извлечении цветов');
        }
    }
    async createOutfit(outfitData) {
        const imageWithoutBg = await (0, image_processing_1.removeBackground)(outfitData.imageUrl);
        const colors = await (0, image_processing_1.extractColors)(imageWithoutBg);
        const outfit = this.outfitsRepository.create({
            ...outfitData,
            imageUrl: imageWithoutBg,
            colors,
        });
        return this.outfitsRepository.save(outfit);
    }
    async getPublicOutfits() {
        return this.outfitsRepository.find({
            take: 20,
            order: { createdAt: 'DESC' },
        });
    }
    async getUserOutfits(userId) {
        return this.outfitsRepository.find({
            where: { user: { id: userId } },
        });
    }
    async deleteOutfit(user, id) {
        const outfit = await this.outfitsRepository.findOne({ where: { id }, relations: ['user'] });
        if (!outfit)
            throw new common_1.NotFoundException('Образ не найден');
        if (outfit.user.id !== user.id)
            throw new common_1.ForbiddenException('Нет прав на удаление');
        await this.outfitsRepository.remove(outfit);
    }
    async getOutfitById(outfitId) {
        const outfit = await this.outfitsRepository.findOne({ where: { id: outfitId } });
        if (!outfit) {
            throw new common_1.NotFoundException('❌ Образ не найден!');
        }
        return outfit;
    }
    async getFilteredOutfits(season, tags, trend) {
        const query = this.outfitsRepository.createQueryBuilder('outfit')
            .where('outfit.isPrivate = :isPrivate', { isPrivate: false });
        ;
        if (season) {
            query.andWhere('LOWER(outfit.season) = LOWER(:season)', { season });
        }
        if (trend) {
            query.andWhere('LOWER(outfit.trend) = LOWER(:trend)', { trend });
        }
        if (tags) {
            const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
            query.andWhere(tagsArray
                .map((tag, index) => `EXISTS (SELECT 1 FROM json_each(outfit.tags) WHERE LOWER(json_each.value) = LOWER(:tag${index}))`)
                .join(' OR '), Object.fromEntries(tagsArray.map((tag, index) => [`tag${index}`, tag])));
        }
        console.log('🔥 Фильтрация с параметрами перед SQL:', { season, tags, trend });
        console.log('🔥 Сформированный SQL-запрос:', query.getSql());
        const results = await query.getMany();
        console.log('🔥 Результаты после фильтрации:', results);
        return results;
    }
    async searchOutfits(query) {
        if (!query) {
            throw new common_2.BadRequestException('❌ Поисковый запрос не должен быть пустым!');
        }
        console.log(`🔥 Ищем по запросу: ${query}`);
        const qb = this.outfitsRepository.createQueryBuilder('outfit');
        qb.where('outfit.isPrivate = false')
            .andWhere(`(LOWER(outfit.title) LIKE LOWER(:q) 
      OR LOWER(outfit.season) LIKE LOWER(:q)
      OR LOWER(outfit.trend) LIKE LOWER(:q)
      OR EXISTS (
        SELECT 1 FROM json_each(outfit.tags) 
        WHERE LOWER(json_each.value) LIKE LOWER(:q)
      ))`, { q: `%${query}%` })
            .orderBy('outfit.rating', 'DESC');
        const results = await qb.getMany();
        console.log(`🔥 Найдено образов: ${results.length}`);
        return results;
    }
    async searchOutfitsByColor(palette) {
        const outfits = await this.outfitsRepository.find({
            where: { isPrivate: false },
        });
        const threshold = 50;
        const matchingOutfits = outfits.filter((outfit) => {
            if (!outfit.colors || !Array.isArray(outfit.colors))
                return false;
            return palette.some((targetColor) => {
                const targetRgb = (0, color_utils_1.hexToRgb)(targetColor);
                return outfit.colors.some((color) => {
                    const rgb = (0, color_utils_1.hexToRgb)(color.trim());
                    return (0, color_utils_1.colorDistance)(targetRgb, rgb) < threshold;
                });
            });
        });
        return matchingOutfits;
    }
    async createFromConstructor(dto, user) {
        const outfit = this.outfitsRepository.create({
            title: dto.title,
            tags: dto.tags,
            season: dto.season,
            trend: dto.trend,
            isPrivate: dto.isPrivate,
            items: dto.items,
            user,
            createdAt: new Date(),
        });
        return await this.outfitsRepository.save(outfit);
    }
    async createFromConstructorUpload(filePath, body, user) {
        const colors = await (0, image_processing_1.extractColors)(filePath);
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
    async createFromConstructorWithScreenshot(dto, user) {
        const canvasWidth = dto.canvasWidth || 1020;
        const canvasHeight = dto.canvasHeight || 760;
        const html = this.generateHTML(dto.items, 280, 400);
        const filename = `outfit_${Date.now()}_${(0, uuid_1.v4)()}.png`;
        const imageUrl = await this.screenshotService.generateOutfitImage(html, filename, 280, 400);
        const colors = await (0, image_processing_1.extractColors)(imageUrl);
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
    generateHTML(items, width, height) {
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
};
exports.OutfitsService = OutfitsService;
exports.OutfitsService = OutfitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(outfit_entity_1.Outfit)),
    __param(1, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        screenshot_service_1.ScreenshotService])
], OutfitsService);
//# sourceMappingURL=outfits.service.js.map