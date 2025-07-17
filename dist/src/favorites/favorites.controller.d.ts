import { User } from '../users/user.entity';
import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    addToFavorites(user: User, outfitId: number): Promise<import("../outfits/favorite.entity").Favorite>;
    removeFromFavorites(user: User, outfitId: number): Promise<{
        message: string;
    }>;
    getUserFavorites(user: User): Promise<import("../outfits/outfit.entity/outfit.entity").Outfit[]>;
}
