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
        console.log("run");
        const browser = await puppeteer.launch({
          executablePath: process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath()
        });
        console.log("run1");
        const page = await browser.newPage();
        console.log("run2");
        const loginPuppeteerRes = await this.authService.loginPuppeteer(page, { username, password }, true)
        await browser.close()
        access_token = loginPuppeteerRes.access_token
      }
      return { access_token, success: true }
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
    }
  }

}
