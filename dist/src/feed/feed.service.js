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
var FeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const outfit_entity_1 = require("../outfits/outfit.entity/outfit.entity");
const outfits_service_1 = require("../outfits/outfits.service");
const weather_service_1 = require("../weather/weather.service");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const date_fns_1 = require("date-fns");
const user_entity_1 = require("../users/user.entity");
const favorite_entity_1 = require("../outfits/favorite.entity");
const typeorm_3 = require("typeorm");
let FeedService = FeedService_1 = class FeedService {
    constructor(outfitsService, weatherService, outfitRepository, userRepository, favoriteRepository) {
        this.outfitsService = outfitsService;
        this.weatherService = weatherService;
        this.outfitRepository = outfitRepository;
        this.userRepository = userRepository;
        this.favoriteRepository = favoriteRepository;
        this.logger = new common_1.Logger(FeedService_1.name);
    }
    async getPopularOutfits() {
        return this.outfitRepository
            .createQueryBuilder('outfit')
            .where('outfit.isPrivate = :isPrivate', { isPrivate: false })
            .orderBy('outfit.rating', 'DESC')
            .limit(20)
            .getMany();
    }
    async getFilteredOutfits(season, tags, trend) {
        return this.outfitsService.getFilteredOutfits(season, tags, trend);
    }
    async searchOutfits(query) {
        return this.outfitsService.searchOutfits(query);
    }
    async searchByColor(palette) {
        return this.outfitsService.searchOutfitsByColor(palette);
    }
    async getRecommendedOutfits(city) {
        this.logger.log(`📌 Получаем рекомендации по погоде. Город: ${city || 'не указан'}`);
        let season = 'all';
        let weatherAdvice = '';
        let tags = [];
        if (city) {
            try {
                const weather = await this.weatherService.getWeather(city);
                const temp = weather.main.temp;
                const weatherCondition = weather.weather[0].main.toLowerCase();
                if (temp < 0)
                    season = 'winter';
                else if (temp >= 0 && temp < 15)
                    season = 'autumn';
                else if (temp >= 15 && temp < 25)
                    season = 'spring';
                else
                    season = 'summer';
                let tags = [];
                if (weatherCondition.includes('rain')) {
                    weatherAdvice = "🌧️ Don’t forget ur umbrella";
                }
                if (weatherCondition.includes('clear')) {
                    weatherAdvice = '☀️ Protect Your Vision from Harmful UV Rays by wearing sunglasses';
                    tags.push('sunglasses');
                }
                if (weatherCondition.includes('clear') && temp > 25) {
                    weatherAdvice = '☀️ Don’t forget to wear a hat so you don’t get sunstroke!';
                }
                if (weatherCondition.includes('rain') && temp > 13) {
                    weatherAdvice += ' 🌦️ Nice day for a Trench Coat!';
                    tags.push('trench coat', 'trench');
                }
                this.logger.log(`📌 Температура: ${temp}°C, сезон: ${season}, погода: ${weatherCondition}`);
            }
            catch (error) {
                this.logger.warn(`⚠️ Ошибка при получении погоды: ${error.message}`);
            }
        }
        const recommendedOutfits = await this.outfitsService.getFilteredOutfits(season, tags.length ? tags.join(',') : undefined);
        return {
            outfits: recommendedOutfits,
            advice: weatherAdvice || '🔥 Удачного дня!',
        };
    }
    async getSmartPersonalizedFeed(user) {
        const favorites = await this.outfitRepository
            .createQueryBuilder('outfit')
            .innerJoin('outfit.favorites', 'fav', 'fav.user_id = :userId', { userId: user.id })
            .getMany();
        const tags = new Set();
        const seasons = new Set();
        const types = new Set();
        for (const outfit of favorites) {
            (outfit.tags || []).forEach(tag => tags.add(tag));
            if (outfit.season)
                seasons.add(outfit.season);
            if (outfit.type)
                types.add(outfit.type);
        }
        const query = this.outfitRepository.createQueryBuilder('outfit');
        query.where('outfit.isPrivate = false')
            .andWhere('outfit.userId != :userId', { userId: user.id });
        if (tags.size > 0) {
            const tagConditions = Array.from(tags).map((_, i) => `outfit.tags LIKE :tag${i}`);
            const tagParams = Object.fromEntries(Array.from(tags).map((t, i) => [`tag${i}`, `%${t}%`]));
            query.andWhere(`(${tagConditions.join(' OR ')})`, tagParams);
        }
        if (seasons.size > 0) {
            query.andWhere('outfit.season IN (:...seasons)', { seasons: Array.from(seasons) });
        }
        if (types.size > 0) {
            query.andWhere('outfit.type IN (:...types)', { types: Array.from(types) });
        }
        query.orderBy('outfit.createdAt', 'DESC').take(10);
        const similar = await query.getMany();
        const popular = await this.outfitRepository.find({
            where: {
                isPrivate: false,
                user: { id: (0, typeorm_3.Not)(user.id) },
            },
            order: { rating: 'DESC' },
            take: 10,
        });
        const recent = await this.outfitRepository.find({
            where: {
                isPrivate: false,
                user: { id: (0, typeorm_3.Not)(user.id) },
                createdAt: (0, typeorm_3.MoreThan)((0, date_fns_1.addDays)(new Date(), -7)),
            },
            order: { createdAt: 'DESC' },
            take: 10,
        });
        const month = new Date().getMonth() + 1;
        let currentSeason = 'spring';
        if ([12, 1, 2].includes(month))
            currentSeason = 'winter';
        else if ([3, 4, 5].includes(month))
            currentSeason = 'spring';
        else if ([6, 7, 8].includes(month))
            currentSeason = 'summer';
        else if ([9, 10, 11].includes(month))
            currentSeason = 'autumn';
        const seasonal = await this.outfitRepository.find({
            where: {
                isPrivate: false,
                user: { id: (0, typeorm_3.Not)(user.id) },
                season: currentSeason,
            },
            order: { createdAt: 'DESC' },
            take: 10,
        });
        const all = [...similar, ...popular, ...recent, ...seasonal];
        const unique = new Map();
        all.forEach(item => unique.set(item.id, item));
        return Array.from(unique.values()).slice(0, 30);
    }
};
exports.FeedService = FeedService;
exports.FeedService = FeedService = FeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_2.InjectRepository)(outfit_entity_1.Outfit)),
    __param(3, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_2.InjectRepository)(favorite_entity_1.Favorite)),
    __metadata("design:paramtypes", [outfits_service_1.OutfitsService,
        weather_service_1.WeatherService,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], FeedService);
//# sourceMappingURL=feed.service.js.map