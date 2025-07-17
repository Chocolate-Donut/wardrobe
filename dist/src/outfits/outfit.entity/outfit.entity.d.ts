import { User } from 'src/users/user.entity';
import { Favorite } from '../favorite.entity';
import { Calendar } from '../../calendar/calendar.entity';
export declare class Outfit {
    id: number;
    title: string;
    imageUrl: string;
    colors: string[];
    tags: string[];
    season: string;
    trend: string;
    user: User;
    isPrivate: boolean;
    createdAt: Date;
    rating: number;
    favorites: Favorite[];
    calendar: Calendar;
    type: string;
    items: any[];
}
