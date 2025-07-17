import { Request } from 'express';
import { ProfileService } from './profile.service';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: Request): Promise<import("../users/user.entity").User>;
    uploadAvatar(file: Express.Multer.File, req: Request): Promise<{
        message: string;
        filePath: string;
    }>;
    updateProfile(req: Request, body: {
        username: string;
    }): Promise<void>;
}
