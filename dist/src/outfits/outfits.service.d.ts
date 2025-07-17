import { Repository } from 'typeorm';
import { Outfit } from './outfit.entity/outfit.entity';
import { User } from '../users/user.entity';
import { Favorite } from './favorite.entity';
import { CreateConstructedLookDto } from './dto/create-constructed-look.dto';
import { ScreenshotService } from '../screenshot/screenshot.service';
export declare class OutfitsService {
    private outfitsRepository;
    private readonly favoritesRepository;
    private screenshotService;
    constructor(outfitsRepository: Repository<Outfit>, favoritesRepository: Repository<Favorite>, screenshotService: ScreenshotService);
    extractColors(imageUrl: string): Promise<string[]>;
    createOutfit(outfitData: any): Promise<Outfit[]>;
    getPublicOutfits(): Promise<Outfit[]>;
    getUserOutfits(userId: number): Promise<Outfit[]>;
    deleteOutfit(user: User, id: number): Promise<void>;
    getOutfitById(outfitId: number): Promise<Outfit>;
    getFilteredOutfits(season?: string, tags?: string, trend?: string): Promise<Outfit[]>;
    searchOutfits(query: string): Promise<Outfit[]>;
    searchOutfitsByColor(palette: string[]): Promise<Outfit[]>;
    createFromConstructor(dto: CreateConstructedLookDto, user: User): Promise<Outfit>;
    createFromConstructorUpload(filePath: string, body: any, user: User): Promise<Outfit>;
    createFromConstructorWithScreenshot(dto: CreateConstructedLookDto, user: User): Promise<Outfit>;
    generateHTML(items: any[], width: number, height: number): string;
}
