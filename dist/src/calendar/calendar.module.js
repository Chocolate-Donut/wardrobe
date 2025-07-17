"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarModule = void 0;
const common_1 = require("@nestjs/common");
const calendar_controller_1 = require("./calendar.controller");
const calendar_service_1 = require("./calendar.service");
const typeorm_1 = require("@nestjs/typeorm");
const calendar_entity_1 = require("./calendar.entity");
const outfit_entity_1 = require("../outfits/outfit.entity/outfit.entity");
const user_entity_1 = require("../users/user.entity");
const auth_module_1 = require("../auth/auth.module");
const config_1 = require("@nestjs/config");
const weather_module_1 = require("../weather/weather.module");
let CalendarModule = class CalendarModule {
};
exports.CalendarModule = CalendarModule;
exports.CalendarModule = CalendarModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([calendar_entity_1.Calendar, outfit_entity_1.Outfit, user_entity_1.User,]), auth_module_1.AuthModule,
            config_1.ConfigModule,
            weather_module_1.WeatherModule],
        controllers: [calendar_controller_1.CalendarController],
        providers: [calendar_service_1.CalendarService],
    })
], CalendarModule);
//# sourceMappingURL=calendar.module.js.map