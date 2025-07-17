import { WardrobeService } from './wardrobe.service';
import { User } from '../users/user.entity';
import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';
import { UpdateWardrobeItemDto } from './dto/update-wardrobe-item.dto';
export declare class WardrobeController {
    private readonly wardrobeService;
    constructor(wardrobeService: WardrobeService);
    uploadClothing(file: Express.Multer.File, dto: CreateWardrobeItemDto, user: User): Promise<import("./wardrobe.entity").Wardrobe>;
    getUserWardrobe(user: User, type: string, tags: string, color: string): Promise<import("./wardrobe.entity").Wardrobe[]>;
    updateClothingType(id: number, dto: UpdateWardrobeItemDto, user: User): Promise<import("./wardrobe.entity").Wardrobe>;
    deleteClothing(id: number, user: User): Promise<void>;
    getColors(user: User): Promise<string[]>;
    processClothing(file: Express.Multer.File): Promise<{
        imageUrl: string;
        colors: string[];
        type: any;
    }>;
}
