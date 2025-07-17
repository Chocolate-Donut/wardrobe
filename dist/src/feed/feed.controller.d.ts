import { FeedService } from './feed.service';
import { User } from '../users/user.entity';
import { Outfit } from '../outfits/outfit.entity/outfit.entity';
export declare class FeedController {
    private readonly feedService;
    constructor(feedService: FeedService);
    getPublicOutfits(): Promise<Outfit[]>;
    getFilteredOutfits(season?: string, tags?: string, trend?: string): Promise<Outfit[]>;
    searchOutfits(query: string): Promise<Outfit[]>;
    searchByColor(palette: string): Promise<Outfit[]>;
    getRecommendedOutfits(city?: string): Promise<{
        outfits: Outfit[];
        advice: string;
    }>;
    getSmartPersonalizedFeed(user: User): Promise<Outfit[]>;
}
