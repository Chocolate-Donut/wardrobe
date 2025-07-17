import { CalendarService } from './calendar.service';
import { User } from '../users/user.entity';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    getUserCalendar(user: User): Promise<import("./calendar.entity").Calendar[]>;
    getCalendarByDate(user: User, date: string): Promise<any>;
    updateEvents(user: User, date: string, body: {
        events: string[];
    }): Promise<import("./calendar.entity").Calendar>;
    removeEvent(user: User, date: string, { event }: {
        event: string;
    }): Promise<import("./calendar.entity").Calendar | null>;
    updateNote(user: User, date: string, { note }: {
        note: string;
    }): Promise<import("./calendar.entity").Calendar>;
    addOutfitToDate(user: User, date: string, body: {
        outfitId: number;
    }): Promise<import("./calendar.entity").Calendar>;
    removeOutfitFromDate(user: User, date: string, body: {
        outfitId: number;
    }): Promise<import("./calendar.entity").Calendar>;
}
