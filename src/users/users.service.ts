import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer'; // ОБЯЗАТЕЛЬНО





@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private mailerService: MailerService,
    ) {}

/*     async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
          });   
        return this.usersRepository.save(user);
    } */

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email } }) || null;
    }
        



    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-значный код
      
        const user = this.usersRepository.create({
          ...createUserDto,
          password: hashedPassword,
          verificationCode, // сохраним код в БД
          isVerified: false,
        });
        await this.usersRepository.save(user);
      
        // 👉 здесь отправь email (например, через nodemailer)
        await this.mailerService.sendMail({
          to: createUserDto.email,
          subject: 'Your verification code',
          text: `Your code is: ${verificationCode}`,
        });
      
        return { message: 'User created. Check your email for verification code.' };
      }
      
      async verifyCode(email: string, code: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) throw new Error('User not found');
    
        console.log('Expected code (from DB):', user.verificationCode);
        console.log('Received code (from frontend):', code);
        console.log('Type of DB code:', typeof user.verificationCode);
        console.log('Type of frontend code:', typeof code);

    
        if ((user.verificationCode || '').toString() !== code.toString()) {
            throw new Error('Invalid code');
        }
    
        user.isVerified = true;
        user.verificationCode = null;
        await this.usersRepository.save(user);
        return { message: 'User verified successfully' };
    }
    
      

}
