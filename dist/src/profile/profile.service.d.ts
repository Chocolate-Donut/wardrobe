import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class ProfileService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    updateAvatar(userId: number, filePath: string): Promise<void>;
    getProfile(userId: number): Promise<User>;
    updateProfile(userId: number, newUsername: string): Promise<void>;
}
