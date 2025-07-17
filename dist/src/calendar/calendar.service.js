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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const calendar_entity_1 = require("./calendar.entity");
const user_entity_1 = require("../users/user.entity");
const weather_service_1 = require("../weather/weather.service");
const outfit_entity_1 = require("../outfits/outfit.entity/outfit.entity");
const dayjs_1 = __importDefault(require("dayjs"));
const isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter"));
dayjs_1.default.extend(isSameOrAfter_1.default);
let CalendarService = class CalendarService {
    constructor(calendarRepository, weatherService, userRepository, outfitRepository) {
        this.calendarRepository = calendarRepository;
        this.weatherService = weatherService;
        this.userRepository = userRepository;
        this.outfitRepository = outfitRepository;
    }
    async getAllCalendarEntries(userId) {
        const calendarEntries = await this.calendarRepository.find({
            where: { user: { id: userId } },
            relations: ['outfits'],
        });
        return calendarEntries;
    }
    async getCalendarByDate(userId, date) {
        let calendarEntry = await this.calendarRepository.findOne({
            where: { user: { id: userId }, date },
            relations: ['outfits'],
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const userCity = user?.city || "Astana";
        let temperature = null;
        let weatherType = null;
        try {
            const weatherData = await this.weatherService.getWeatherForDate(userCity, date);
            temperature = weatherData.temperature;
            weatherType = weatherData.weatherType;
        }
        catch (err) {
            console.warn('⚠️ Ошибка получения погоды:', err.message);
        }
        if (!calendarEntry) {
            return {
                date,
                events: [],
                note: '',
                outfits: [],
                temperature,
                weatherType,
            };
        }
        return {
            date: calendarEntry.date,
            events: calendarEntry.events,
            note: calendarEntry.note,
            outfits: calendarEntry.outfits,
            temperature,
            weatherType,
        };
    }
    async addEvent(userId, date, event) {
        let calendarEntry = await this.calendarRepository.findOne({
            where: { date, user: { id: userId } }
        });
        if (!calendarEntry) {
            calendarEntry = this.calendarRepository.create({
                date,
                user: { id: userId },
                events: [event],
                isImportant: true
            });
        }
        else {
            if (!calendarEntry.events) {
                calendarEntry.events = [];
            }
            if (!calendarEntry.events.includes(event)) {
                calendarEntry.events.push(event);
            }
            calendarEntry.isImportant = true;
        }
        return this.calendarRepository.save(calendarEntry);
    }
    async removeEvent(userId, date, event) {
        const calendarEntry = await this.calendarRepository.findOne({
            where: { date, user: { id: userId } }
        });
        if (!calendarEntry || !calendarEntry.events)
            return null;
        calendarEntry.events = calendarEntry.events.filter(e => e !== event);
        calendarEntry.isImportant = calendarEntry.events.length > 0;
        return this.calendarRepository.save(calendarEntry);
    }
    async updateNote(userId, date, note) {
        let calendarEntry = await this.calendarRepository.findOne({ where: { date, user: { id: userId } } });
        if (!calendarEntry) {
            calendarEntry = this.calendarRepository.create({ date, user: { id: userId }, note });
        }
        else {
            calendarEntry.note = note;
        }
        return this.calendarRepository.save(calendarEntry);
    }
    async addOutfitToDate(userId, date, outfitId) {
        let calendarEntry = await this.calendarRepository.findOne({
            where: { user: { id: userId }, date },
            relations: ['outfits'],
        });
        if (!calendarEntry) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user)
                throw new Error('Пользователь не найден');
            calendarEntry = this.calendarRepository.create({
                date,
                user,
                events: [],
                outfits: [],
                isImportant: true,
            });
        }
        const outfit = await this.outfitRepository.findOne({ where: { id: outfitId } });
        if (!outfit) {
            throw new Error('Образ с таким ID не найден.');
        }
        if (!calendarEntry.outfits.some(o => o.id === outfitId)) {
            calendarEntry.outfits.push(outfit);
        }
        return this.calendarRepository.save(calendarEntry);
    }
    async removeOutfitFromDate(userId, date, outfitId) {
        const calendarEntry = await this.calendarRepository.findOne({
            where: { user: { id: userId }, date },
            relations: ['outfits'],
        });
        if (!calendarEntry) {
            throw new Error('Запись для этой даты не найдена.');
        }
        const outfitIndex = calendarEntry.outfits.findIndex((outfit) => outfit.id === outfitId);
        if (outfitIndex === -1) {
            throw new Error('Образ не найден на этой дате.');
        }
        calendarEntry.outfits.splice(outfitIndex, 1);
        return this.calendarRepository.save(calendarEntry);
    }
    async updateEvents(userId, date, newEvents) {
        let calendarEntry = await this.calendarRepository.findOne({
            where: { date, user: { id: userId } }
        });
        const cleanedEvents = newEvents
            .map(e => e.trim())
            .filter(e => e.length > 0);
        if (!calendarEntry) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user)
                throw new Error('Пользователь не найден');
            calendarEntry = this.calendarRepository.create({
                date,
                user,
                events: cleanedEvents.length > 0 ? cleanedEvents : null,
                isImportant: cleanedEvents.length > 0
            });
        }
        else {
            calendarEntry.events = cleanedEvents.length > 0 ? cleanedEvents : null;
            calendarEntry.isImportant = cleanedEvents.length > 0;
        }
        return this.calendarRepository.save(calendarEntry);
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_entity_1.Calendar)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(outfit_entity_1.Outfit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        weather_service_1.WeatherService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map