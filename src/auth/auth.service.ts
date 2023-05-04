import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import puppeteer from 'puppeteer';

@Injectable()
export class AuthService {
  async login(username: string, password: string) {
    const browser = await puppeteer.launch({
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
  
    // Set screen size
    await page.setViewport({ width: 1280, height: 1024 });
  
    await page.waitForSelector('#email')
    // Type into search box
    await page.type('#email', username, { delay: 30 });
  
    await page.waitForTimeout(500)
  
    await page.waitForSelector('#password')
    // Type into search box
    await page.type('#password', password, { delay: 30 });
  
    await page.waitForTimeout(500)
  
    await page.click('button[name="btn_submit"')
  
    await page.waitForSelector('.content')
  
    await page.waitForTimeout(800)

    await page.screenshot({ path: `screenshots/${moment(new Date()).format('DD-MM-YYYY h_mm_ss_a')}.jpeg` })
  
  }
}
