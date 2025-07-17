import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    verify(body: {
        email: string;
        code: string;
    }): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<import("./user.entity").User[]>;
}
