"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedModule = void 0;
const common_1 = require("@nestjs/common");
const feed_controller_1 = require("./feed.controller");
const feed_service_1 = require("./feed.service");
const outfits_module_1 = require("../outfits/outfits.module");
const auth_module_1 = require("../auth/auth.module");
const config_1 = require("@nestjs/config");
const weather_module_1 = require("../weather/weather.module");
const users_module_1 = require("../users/users.module");
let FeedModule = class FeedModule {
};
exports.FeedModule = FeedModule;
exports.FeedModule = FeedModule = __decorate([
    (0, common_1.Module)({
        imports: [outfits_module_1.OutfitsModule, config_1.ConfigModule, auth_module_1.AuthModule, weather_module_1.WeatherModule, users_module_1.UsersModule,],
        controllers: [feed_controller_1.FeedController],
        providers: [feed_service_1.FeedService],
    })
], FeedModule);
//# sourceMappingURL=feed.module.js.map