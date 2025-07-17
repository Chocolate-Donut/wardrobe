"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutfitsModule = void 0;
const common_1 = require("@nestjs/common");
const outfits_service_1 = require("./outfits.service");
const outfits_controller_1 = require("./outfits.controller");
const typeorm_1 = require("@nestjs/typeorm");
const outfit_entity_1 = require("./outfit.entity/outfit.entity");
const auth_module_1 = require("../auth/auth.module");
const config_1 = require("@nestjs/config");
const favorite_entity_1 = require("./favorite.entity");
const screenshot_module_1 = require("../screenshot/screenshot.module");
let OutfitsModule = class OutfitsModule {
};
exports.OutfitsModule = OutfitsModule;
exports.OutfitsModule = OutfitsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([outfit_entity_1.Outfit, favorite_entity_1.Favorite]),
            auth_module_1.AuthModule,
            screenshot_module_1.ScreenshotModule,
        ],
        controllers: [outfits_controller_1.OutfitsController],
        providers: [outfits_service_1.OutfitsService],
        exports: [outfits_service_1.OutfitsService, typeorm_1.TypeOrmModule],
    })
], OutfitsModule);
//# sourceMappingURL=outfits.module.js.map