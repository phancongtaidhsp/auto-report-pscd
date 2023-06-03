"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entities/user.entity");
const typeorm_2 = require("typeorm");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async loginPuppeteer(page, user, isFirstLogin = false) {
        console.log("running login");
        const { username, password } = user;
        await page.goto('http://reports.pscds.com/login', { waitUntil: 'domcontentloaded' });
        await page.setViewport({ width: 1280, height: 1024 });
        await page.waitForSelector('#email');
        await page.type('#email', username, { delay: 30 });
        await page.waitForTimeout(500);
        await page.waitForSelector('#password');
        await page.type('#password', password, { delay: 30 });
        await page.waitForTimeout(500);
        await page.click('button[name="btn_submit"');
        await page.waitForSelector('.content');
        await page.waitForTimeout(800);
        if (isFirstLogin) {
            const { id } = await this.userRepository.save(user);
            return {
                access_token: await this.jwtService.signAsync({ id, username }),
            };
        }
        console.log("end loging");
    }
    async login({ username, password }) {
        const user = await this.userRepository.findOne({
            where: {
                username,
                password
            }
        });
        if (user) {
            return {
                access_token: await this.jwtService.signAsync({ id: user.id, username }),
            };
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map