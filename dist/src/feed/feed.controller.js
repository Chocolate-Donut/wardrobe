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
exports.FeedController = void 0;
const common_1 = require("@nestjs/common");
const feed_service_1 = require("./feed.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const user_entity_1 = require("../users/user.entity");
let FeedController = class FeedController {
    constructor(feedService) {
        this.feedService = feedService;
    }
    getPublicOutfits() {
        return this.feedService.getPopularOutfits();
    }
    async getFilteredOutfits(season, tags, trend) {
        console.log('🔥🔥🔥 Контроллер вызван!');
        console.log('🔥 Контроллер получил параметры:', { season, tags, trend });
        return this.feedService.getFilteredOutfits(season, tags, trend);
    }
    async searchOutfits(query) {
        console.log(`🔥 Запрос на поиск: ${query}`);
        return this.feedService.searchOutfits(query);
    }
    async searchByColor(palette) {
        let parsedPalette;
        try {
            parsedPalette = JSON.parse(palette);
        }
        catch (error) {
            throw new Error('Невозможно распарсить палитру. Убедитесь, что передаете массив.');
        }
        if (!Array.isArray(parsedPalette)) {
            throw new Error('Палитра должна быть массивом');
        }
        if (parsedPalette.length === 0) {
            throw new Error('Палитра цветов не может быть пустой!');
        }
        return this.feedService.searchByColor(parsedPalette);
    }
    async getRecommendedOutfits(city) {
        return this.feedService.getRecommendedOutfits(city);
    }
    getSmartPersonalizedFeed(user) {
        return this.feedService.getSmartPersonalizedFeed(user);
    }
};
exports.FeedController = FeedController;
__decorate([
    (0, common_1.Get)('popular'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "getPublicOutfits", null);
__decorate([
    (0, common_1.Get)('filter'),
    __param(0, (0, common_1.Query)('season')),
    __param(1, (0, common_1.Query)('tags')),
    __param(2, (0, common_1.Query)('trend')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FeedController.prototype, "getFilteredOutfits", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedController.prototype, "searchOutfits", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search-by-color'),
    __param(0, (0, common_1.Query)('palette')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedController.prototype, "searchByColor", null);
__decorate([
    (0, common_1.Get)('recommended'),
    __param(0, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedController.prototype, "getRecommendedOutfits", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('smart'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FeedController.prototype, "getSmartPersonalizedFeed", null);
exports.FeedController = FeedController = __decorate([
    (0, common_1.Controller)('feed'),
    __metadata("design:paramtypes", [feed_service_1.FeedService])
], FeedController);
//# sourceMappingURL=feed.controller.js.map