import { Repository } from 'typeorm';
import { Favorite } from '../outfits/favorite.entity';
import { User } from '../users/user.entity';
import { Outfit } from '../outfits/outfit.entity/outfit.entity';
export declare class FavoritesService {
    private readonly favoriteRepository;
    private readonly outfitRepository;
    private readonly userRepository;
    constructor(favoriteRepository: Repository<Favorite>, outfitRepository: Repository<Outfit>, userRepository: Repository<User>);
    addToFavorites(userId: number, outfitId: number): Promise<Favorite>;
    removeFromFavorites(userId: number, outfitId: number): Promise<{
        message: string;
    }>;
    getUserFavorites(userId: number): Promise<Outfit[]>;
}
