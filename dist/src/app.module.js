"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const outfits_module_1 = require("./outfits/outfits.module");
const weather_module_1 = require("./weather/weather.module");
const profile_module_1 = require("./profile/profile.module");
const feed_module_1 = require("./feed/feed.module");
const favorites_module_1 = require("./favorites/favorites.module");
const calendar_module_1 = require("./calendar/calendar.module");
const wardrobe_module_1 = require("./wardrobe/wardrobe.module");
const screenshot_service_1 = require("./screenshot/screenshot.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'wardrobe.db',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                logging: true,
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            outfits_module_1.OutfitsModule,
            weather_module_1.WeatherModule,
            profile_module_1.ProfileModule,
            feed_module_1.FeedModule,
            favorites_module_1.FavoritesModule,
            calendar_module_1.CalendarModule,
            wardrobe_module_1.WardrobeModule,
        ],
        providers: [screenshot_service_1.ScreenshotService],
        exports: [screenshot_service_1.ScreenshotService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map