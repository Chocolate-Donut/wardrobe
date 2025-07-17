import { Outfit } from 'src/outfits/outfit.entity/outfit.entity';
import { Favorite } from '../outfits/favorite.entity';
import { Calendar } from '../calendar/calendar.entity';
import { Wardrobe } from '../wardrobe/wardrobe.entity';
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    avatar: string;
    city: string;
    outfits: Outfit[];
    favorites: Favorite[];
    isPrivate: boolean;
    calendar: Calendar[];
    wardrobe: Wardrobe[];
    verificationCode: string | null;
    isVerified: boolean;
}
