"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutfitsController = void 0;
const common_1 = require("@nestjs/common");
const outfits_service_1 = require("./outfits.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const user_entity_1 = require("../users/user.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer = __importStar(require("multer"));
const path_1 = require("path");
const fs_1 = require("fs");
const create_constructed_look_dto_1 = require("./dto/create-constructed-look.dto");
let OutfitsController = class OutfitsController {
    constructor(outfitsService) {
        this.outfitsService = outfitsService;
    }
    async getAllPublicOutfits() {
        return this.outfitsService.getFilteredOutfits();
    }
    async getMyOutfits(req) {
        if (!req.user) {
            throw new Error('Пользователь не найден в запросе');
        }
        console.log('req.user:', req.user);
        const userId = req.user.sub;
        return this.outfitsService.getUserOutfits(userId);
    }
    async uploadFile(file, body, user) {
        console.log('File uploaded:', file);
        const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
        if (!(0, fs_1.existsSync)(uploadsDir)) {
            (0, fs_1.mkdirSync)(uploadsDir);
        }
        const filePath = (0, path_1.join)(uploadsDir, file.originalname);
        console.log('File path for color extraction:', filePath);
        try {
            const colors = await this.outfitsService.extractColors(filePath);
            console.log('Extracted colors:', colors);
            await this.outfitsService.createOutfit({
                imageUrl: filePath,
                colors: JSON.stringify(colors),
                title: body.title,
                tags: body.tags,
                season: body.season,
                trend: body.trend,
                user: user,
            });
            return { message: 'File uploaded and colors extracted successfully', file, colors, processedImagePath: filePath, };
        }
        catch (error) {
            console.error('Error during file upload and color extraction:', error);
            return { message: 'Error during file upload and color extraction', error };
        }
    }
    deleteOutfit(user, id) {
        return this.outfitsService.deleteOutfit(user, id);
    }
    async searchOutfits(query) {
        return this.outfitsService.searchOutfits(query);
    }
    async searchByColor(palette) {
        return this.outfitsService.searchOutfitsByColor(palette);
    }
    async getOutfitById(outfitId) {
        const id = parseInt(outfitId, 10);
        if (isNaN(id)) {
            throw new common_1.BadRequestException('❌ Неверный формат ID');
        }
        return this.outfitsService.getOutfitById(id);
    }
    createFromConstructor(dto, user) {
        return this.outfitsService.createFromConstructor(dto, user);
    }
    async createLookFromJson(dto, user) {
        return this.outfitsService.createFromConstructorWithScreenshot(dto, user);
    }
};
exports.OutfitsController = OutfitsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "getAllPublicOutfits", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-outfits'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "getMyOutfits", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: multer.diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                callback(null, file.originalname);
            }
        })
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "deleteOutfit", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "searchOutfits", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('search-by-color'),
    __param(0, (0, common_1.Body)('palette')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "searchByColor", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "getOutfitById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_constructed_look_dto_1.CreateConstructedLookDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], OutfitsController.prototype, "createFromConstructor", null);
__decorate([
    (0, common_1.Post)('constructor/json'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_constructed_look_dto_1.CreateConstructedLookDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "createLookFromJson", null);
exports.OutfitsController = OutfitsController = __decorate([
    (0, common_1.Controller)('outfits'),
    __metadata("design:paramtypes", [outfits_service_1.OutfitsService])
], OutfitsController);
//# sourceMappingURL=outfits.controller.js.map