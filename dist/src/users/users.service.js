"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = __importStar(require("bcrypt"));
const mailer_1 = require("@nestjs-modules/mailer");
let UsersService = class UsersService {
    constructor(usersRepository, mailerService) {
        this.usersRepository = usersRepository;
        this.mailerService = mailerService;
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findByEmail(email) {
        return await this.usersRepository.findOne({ where: { email } }) || null;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
            verificationCode,
            isVerified: false,
        });
        await this.usersRepository.save(user);
        await this.mailerService.sendMail({
            to: createUserDto.email,
            subject: 'Your verification code',
            text: `Your code is: ${verificationCode}`,
        });
        return { message: 'User created. Check your email for verification code.' };
    }
    async verifyCode(email, code) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user)
            throw new Error('User not found');
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_1.MailerService])
], UsersService);
//# sourceMappingURL=users.service.js.map