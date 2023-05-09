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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const puppeteer_1 = require("puppeteer");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(username, password) {
        try {
            let access_token = null;
            const loginRes = await this.authService.login({ username, password });
            if (loginRes) {
                access_token = loginRes.access_token;
            }
            else {
                console.log("run");
                const browser = await puppeteer_1.default.launch({
                    ignoreHTTPSErrors: true,
                    ignoreDefaultArgs: ['--enable-automation'],
                    args: [
                        `--window-size=1280,1024`,
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-infobars',
                        '--ignore-certifcate-errors',
                        '--ignore-certifcate-errors-spki-list',
                        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
                    ],
                });
                console.log("run1");
                const page = await browser.newPage();
                console.log("run2");
                const loginPuppeteerRes = await this.authService.loginPuppeteer(page, { username, password }, true);
                await browser.close();
                access_token = loginPuppeteerRes.access_token;
            }
            return { access_token, success: true };
        }
        catch (error) {
            throw new common_1.HttpException('Bad request', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('username')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map