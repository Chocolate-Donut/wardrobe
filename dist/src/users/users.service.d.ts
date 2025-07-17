import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
export declare class UsersService {
    private usersRepository;
    private mailerService;
    constructor(usersRepository: Repository<User>, mailerService: MailerService);
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    verifyCode(email: string, code: string): Promise<{
        message: string;
    }>;
}
