import { Controller, Post, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import puppeteer from 'puppeteer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    try {
      let access_token = null
      const loginRes = await this.authService.login({ username, password })
      if (loginRes) {
        access_token = loginRes.access_token
      } else {
        const browser = await puppeteer.launch({
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
        const loginPuppeteerRes = await this.authService.loginPuppeteer(page, { username, password }, true)
        access_token = loginPuppeteerRes.access_token
      }
      return { access_token, success: true }
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
    }
  }

}
