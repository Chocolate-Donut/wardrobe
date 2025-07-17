import { User } from 'src/users/user.entity';
import { Outfit } from 'src/outfits/outfit.entity/outfit.entity';
export declare class Favorite {
    id: number;
    user: User;
    outfit: Outfit;
}
