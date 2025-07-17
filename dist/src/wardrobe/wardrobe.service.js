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
exports.WardrobeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wardrobe_entity_1 = require("./wardrobe.entity");
const image_processing_1 = require("../utils/image-processing");
const clarifai_1 = require("../utils/clarifai");
let WardrobeService = class WardrobeService {
    constructor(wardrobeRepository) {
        this.wardrobeRepository = wardrobeRepository;
    }
    async getUniqueColors(user) {
        const items = await this.wardrobeRepository.find({
            where: { user: { id: user.id } },
        });
        const allColors = items.flatMap(item => item.colors);
        const uniqueColors = Array.from(new Set(allColors));
        return uniqueColors;
    }
    async uploadClothing(filePath, dto, user) {
        console.log('File path:', filePath);
        console.log('DTO:', dto);
        const imageWithoutBg = await (0, image_processing_1.removeBackground)(filePath);
        const colors = await (0, image_processing_1.extractColors)(imageWithoutBg);
        const clothingType = await (0, clarifai_1.detectClothingType)(imageWithoutBg);
        console.log('Detected Clothing Type:', clothingType);
        console.log('Extracted Colors:', colors);
        const wardrobeItem = this.wardrobeRepository.create({
            imageUrl: imageWithoutBg,
            colors: colors || [],
            type: clothingType.type || 'Unknown',
            tags: dto.tags || [],
            season: dto.season || '',
            brand: dto.brand || '',
            user,
        });
        return await this.wardrobeRepository.save(wardrobeItem);
    }
    async getUserWardrobe(user, type, tags, color) {
        const queryBuilder = this.wardrobeRepository.createQueryBuilder('wardrobe');
        queryBuilder.where('wardrobe.userId = :userId', { userId: user.id });
        if (type) {
            queryBuilder.andWhere('wardrobe.type LIKE :type', { type: `%${type}%` });
        }
        if (tags) {
            const tagsArray = tags.split(',');
            tagsArray.forEach((tag, index) => {
                queryBuilder.andWhere(`wardrobe.tags LIKE :tag${index}`, {
                    [`tag${index}`]: `%${tag}%`,
                });
            });
        }
        if (color) {
            queryBuilder.andWhere('wardrobe.colors LIKE :color', { color: `%${color}%` });
        }
        return await queryBuilder.getMany();
    }
    async updateClothingType(id, dto, user) {
        const wardrobeItem = await this.wardrobeRepository.findOne({ where: { id, user: { id: user.id } } });
        if (!wardrobeItem)
            throw new common_1.NotFoundException('Одежда не найдена');
        wardrobeItem.type = dto.type || wardrobeItem.type;
        wardrobeItem.tags = dto.tags || wardrobeItem.tags;
        wardrobeItem.season = dto.season || wardrobeItem.season;
        wardrobeItem.brand = dto.brand || wardrobeItem.brand;
        return await this.wardrobeRepository.save(wardrobeItem);
    }
    async deleteClothing(id, user) {
        const wardrobeItem = await this.wardrobeRepository.findOne({ where: { id, user: { id: user.id } } });
        if (!wardrobeItem)
            throw new common_1.NotFoundException('Одежда не найдена');
        await this.wardrobeRepository.remove(wardrobeItem);
    }
    async processClothing(filePath) {
        const imageWithoutBg = await (0, image_processing_1.removeBackground)(filePath);
        const colors = await (0, image_processing_1.extractColors)(imageWithoutBg);
        const clothingType = await (0, clarifai_1.detectClothingType)(imageWithoutBg);
        return {
            imageUrl: imageWithoutBg,
            colors,
            type: clothingType.type,
        };
    }
};
exports.WardrobeService = WardrobeService;
exports.WardrobeService = WardrobeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wardrobe_entity_1.Wardrobe)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WardrobeService);
//# sourceMappingURL=wardrobe.service.js.map