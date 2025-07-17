import { OutfitsService } from './outfits.service';
import { Outfit } from './outfit.entity/outfit.entity';
import { User } from '../users/user.entity';
import { Request } from 'express';
import { CreateConstructedLookDto } from './dto/create-constructed-look.dto';
export declare class OutfitsController {
    private readonly outfitsService;
    constructor(outfitsService: OutfitsService);
    getAllPublicOutfits(): Promise<Outfit[]>;
    getMyOutfits(req: Request & {
        user?: any;
    }): Promise<Outfit[]>;
    uploadFile(file: Express.Multer.File, body: {
        title: string;
        tags: string[];
        season: string;
        trend: string;
    }, user: User): Promise<{
        message: string;
        file: Express.Multer.File;
        colors: string[];
        processedImagePath: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
        file?: undefined;
        colors?: undefined;
        processedImagePath?: undefined;
    }>;
    deleteOutfit(user: User, id: number): Promise<void>;
    searchOutfits(query: string): Promise<Outfit[]>;
    searchByColor(palette: string[]): Promise<Outfit[]>;
    getOutfitById(outfitId: string): Promise<Outfit>;
    createFromConstructor(dto: CreateConstructedLookDto, user: User): Promise<Outfit>;
    createLookFromJson(dto: CreateConstructedLookDto, user: User): Promise<Outfit>;
}
