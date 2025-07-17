import { User } from '../users/user.entity';
import { Outfit } from '../outfits/outfit.entity/outfit.entity';
export declare class Calendar {
    id: number;
    date: string;
    note: string;
    user: User;
    outfits: Outfit[];
    isImportant: boolean;
    events: string[] | null;
    temperature: number;
    weatherType: string;
}
