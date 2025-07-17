import { Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { User } from '../users/user.entity';
import { WeatherService } from '../weather/weather.service';
import { Outfit } from 'src/outfits/outfit.entity/outfit.entity';
export declare class CalendarService {
    private readonly calendarRepository;
    private readonly weatherService;
    private readonly userRepository;
    private readonly outfitRepository;
    constructor(calendarRepository: Repository<Calendar>, weatherService: WeatherService, userRepository: Repository<User>, outfitRepository: Repository<Outfit>);
    getAllCalendarEntries(userId: number): Promise<Calendar[]>;
    getCalendarByDate(userId: number, date: string): Promise<any>;
    addEvent(userId: number, date: string, event: string): Promise<Calendar>;
    removeEvent(userId: number, date: string, event: string): Promise<Calendar | null>;
    updateNote(userId: number, date: string, note: string): Promise<Calendar>;
    addOutfitToDate(userId: number, date: string, outfitId: number): Promise<Calendar>;
    removeOutfitFromDate(userId: number, date: string, outfitId: number): Promise<Calendar>;
    updateEvents(userId: number, date: string, newEvents: string[]): Promise<Calendar>;
}
