import { User } from 'src/users/user.entity';
export declare class Wardrobe {
    id: number;
    imageUrl: string;
    colors: string[];
    type: string;
    tags: string[];
    season: string;
    brand: string;
    user: User;
    createdAt: Date;
}
