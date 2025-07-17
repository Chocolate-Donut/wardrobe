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
exports.WardrobeController = void 0;
const common_1 = require("@nestjs/common");
const wardrobe_service_1 = require("./wardrobe.service");
const user_entity_1 = require("../users/user.entity");
const create_wardrobe_item_dto_1 = require("./dto/create-wardrobe-item.dto");
const update_wardrobe_item_dto_1 = require("./dto/update-wardrobe-item.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
let WardrobeController = class WardrobeController {
    constructor(wardrobeService) {
        this.wardrobeService = wardrobeService;
    }
    async uploadClothing(file, dto, user) {
        if (!file) {
            throw new common_1.BadRequestException('Файл не загружен');
        }
        const completeDto = {
            ...dto,
            colors: dto.colors || [],
            type: dto.type || undefined,
            imageUrl: dto.imageUrl || undefined
        };
        return this.wardrobeService.uploadClothing(file.path, completeDto, user);
    }
    async getUserWardrobe(user, type, tags, color) {
        return this.wardrobeService.getUserWardrobe(user, type, tags);
    }
    async updateClothingType(id, dto, user) {
        return this.wardrobeService.updateClothingType(id, dto, user);
    }
    async deleteClothing(id, user) {
        return this.wardrobeService.deleteClothing(id, user);
    }
    async getColors(user) {
        return this.wardrobeService.getUniqueColors(user);
    }
    async processClothing(file) {
        if (!file)
            throw new common_1.BadRequestException('Файл не загружен');
        return this.wardrobeService.processClothing(file.path);
    }
};
exports.WardrobeController = WardrobeController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_wardrobe_item_dto_1.CreateWardrobeItemDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "uploadClothing", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('tags')),
    __param(3, (0, common_1.Query)('color')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String, String]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "getUserWardrobe", null);
__decorate([
    (0, common_1.Put)(':id/type'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_wardrobe_item_dto_1.UpdateWardrobeItemDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "updateClothingType", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "deleteClothing", null);
__decorate([
    (0, common_1.Get)('colors'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "getColors", null);
__decorate([
    (0, common_1.Post)('process'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "processClothing", null);
exports.WardrobeController = WardrobeController = __decorate([
    (0, common_1.Controller)('wardrobe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [wardrobe_service_1.WardrobeService])
], WardrobeController);
//# sourceMappingURL=wardrobe.controller.js.map