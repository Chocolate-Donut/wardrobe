import { Repository } from 'typeorm';
import { Wardrobe } from './wardrobe.entity';
import { User } from '../users/user.entity';
import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';
import { UpdateWardrobeItemDto } from './dto/update-wardrobe-item.dto';
export declare class WardrobeService {
    private wardrobeRepository;
    constructor(wardrobeRepository: Repository<Wardrobe>);
    getUniqueColors(user: User): Promise<string[]>;
    uploadClothing(filePath: string, dto: CreateWardrobeItemDto, user: User): Promise<Wardrobe>;
    getUserWardrobe(user: User, type: string, tags: string, color?: string): Promise<Wardrobe[]>;
    updateClothingType(id: number, dto: UpdateWardrobeItemDto, user: User): Promise<Wardrobe>;
    deleteClothing(id: number, user: User): Promise<void>;
    processClothing(filePath: string): Promise<{
        imageUrl: string;
        colors: string[];
        type: any;
    }>;
}
