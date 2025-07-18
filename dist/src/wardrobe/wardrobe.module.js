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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WardrobeModule = void 0;
const common_1 = require("@nestjs/common");
const wardrobe_entity_1 = require("./wardrobe.entity");
const wardrobe_controller_1 = require("./wardrobe.controller");
const wardrobe_service_1 = require("./wardrobe.service");
const typeorm_1 = require("@nestjs/typeorm");
const outfits_module_1 = require("../outfits/outfits.module");
const auth_module_1 = require("../auth/auth.module");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = __importStar(require("path"));
let WardrobeModule = class WardrobeModule {
};
exports.WardrobeModule = WardrobeModule;
exports.WardrobeModule = WardrobeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([wardrobe_entity_1.Wardrobe]), config_1.ConfigModule, outfits_module_1.OutfitsModule, auth_module_1.AuthModule, platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads/wardrobe',
                    filename: (req, file, cb) => {
                        const ext = path.extname(file.originalname);
                        const filename = `wardrobe_${Date.now()}${ext}`;
                        cb(null, filename);
                    },
                }),
            }),],
        controllers: [wardrobe_controller_1.WardrobeController],
        providers: [wardrobe_service_1.WardrobeService],
    })
], WardrobeModule);
//# sourceMappingURL=wardrobe.module.js.map