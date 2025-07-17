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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let WeatherService = class WeatherService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async getWeatherByCoords(lat, lon) {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`));
            if (response && response.data) {
                return response.data;
            }
            else {
                throw new Error('Ошибка получения данных погоды');
            }
        }
        catch (error) {
            console.error('Ошибка при получении данных погоды:', error);
            throw new Error('Ошибка при получении данных погоды');
        }
    }
    async getWeather(city) {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
        return response.data;
    }
    async getWeatherForDate(city, date) {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
        const forecastList = response.data.list;
        console.log('Forecast list:', forecastList);
        const forecast = forecastList.find(f => f.dt_txt.startsWith(date));
        if (!forecast) {
            console.error(`No weather data found for the date: ${date}`);
            throw new Error("Прогноз погоды на указанную дату не найден.");
        }
        return {
            temperature: forecast.main.temp,
            weatherType: forecast.weather[0].description,
        };
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map