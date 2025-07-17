import { Outfit } from '../outfits/outfit.entity/outfit.entity';
import { OutfitsService } from '../outfits/outfits.service';
import { WeatherService } from '../weather/weather.service';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Favorite } from 'src/outfits/favorite.entity';
export declare class FeedService {
    private readonly outfitsService;
    private readonly weatherService;
    private readonly outfitRepository;
    private readonly userRepository;
    private readonly favoriteRepository;
    private readonly logger;
    constructor(outfitsService: OutfitsService, weatherService: WeatherService, outfitRepository: Repository<Outfit>, userRepository: Repository<User>, favoriteRepository: Repository<Favorite>);
    getPopularOutfits(): Promise<Outfit[]>;
    getFilteredOutfits(season?: string, tags?: string, trend?: string): Promise<Outfit[]>;
    searchOutfits(query: string): Promise<Outfit[]>;
    searchByColor(palette: any): Promise<Outfit[]>;
    getRecommendedOutfits(city?: string): Promise<{
        outfits: Outfit[];
        advice: string;
    }>;
    getSmartPersonalizedFeed(user: User): Promise<Outfit[]>;
}
