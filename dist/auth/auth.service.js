"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const puppeteer_1 = require("puppeteer");
let AuthService = class AuthService {
    async login(username, password) {
        const browser = await puppeteer_1.default.launch({
            headless: true,
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
        const page = await browser.newPage();
        await page.goto('http://reports.pscds.com/login');
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
        await page.screenshot({ path: `screenshots/${moment(new Date()).format('DD-MM-YYYY h_mm_ss_a')}.jpeg` });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map