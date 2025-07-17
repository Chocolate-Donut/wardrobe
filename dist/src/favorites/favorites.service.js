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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("../outfits/favorite.entity");
const user_entity_1 = require("../users/user.entity");
const outfit_entity_1 = require("../outfits/outfit.entity/outfit.entity");
let FavoritesService = class FavoritesService {
    constructor(favoriteRepository, outfitRepository, userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.outfitRepository = outfitRepository;
        this.userRepository = userRepository;
    }
    async addToFavorites(userId, outfitId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const outfit = await this.outfitRepository.findOne({ where: { id: outfitId } });
        if (!outfit) {
            throw new common_1.NotFoundException('Образ не найден');
        }
        const exists = await this.favoriteRepository.findOne({
            where: { user: { id: userId }, outfit: { id: outfitId } },
        });
        if (exists) {
            throw new Error('Этот образ уже в избранном!');
        }
        outfit.rating = (outfit.rating || 0) + 1;
        await this.outfitRepository.save(outfit);
        const favorite = this.favoriteRepository.create({ user, outfit });
        return this.favoriteRepository.save(favorite);
    }
    async removeFromFavorites(userId, outfitId) {
        const favorite = await this.favoriteRepository.findOne({
            where: { user: { id: userId }, outfit: { id: outfitId } },
            relations: ['outfit'],
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Образ не найден в избранном');
        }
        const outfit = favorite.outfit;
        outfit.rating = Math.max(0, (outfit.rating || 0) - 1);
        await this.outfitRepository.save(outfit);
        await this.favoriteRepository.remove(favorite);
        return { message: 'Образ удалён из избранного' };
    }
    async getUserFavorites(userId) {
        const favorites = await this.favoriteRepository.find({
            where: { user: { id: userId } },
            relations: ['outfit'],
        });
        return favorites.map((fav) => fav.outfit);
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(1, (0, typeorm_1.InjectRepository)(outfit_entity_1.Outfit)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map