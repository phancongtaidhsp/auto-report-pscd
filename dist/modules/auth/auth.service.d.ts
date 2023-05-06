import { JwtService } from '@nestjs/jwt';
import { Page } from 'puppeteer';
import { UserModel } from 'src/models/user.model';
import { Repository } from 'typeorm';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<UserModel>, jwtService: JwtService);
    loginPuppeteer(page: Page, user: UserModel, isFirstLogin?: boolean): Promise<{
        access_token: string;
    }>;
    login({ username, password }: UserModel): Promise<{
        access_token: string;
    }>;
}
