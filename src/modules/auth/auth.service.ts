import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import puppeteer, { Page } from 'puppeteer';
import { UserEntity } from 'src/entities/user.entity';
import { UserModel } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserModel>,
    private jwtService: JwtService
  ) { }

  async loginPuppeteer(page: Page, user: UserModel, isFirstLogin = false) {
    const { username, password } = user;

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

    if(isFirstLogin) {
      const { id } = await this.userRepository.save(user)
      
      return {
        access_token: await this.jwtService.signAsync({ id, username }),
      }
    }

  }

  async login({ username, password }: UserModel) {
    const user = await this.userRepository.findOne({
      where: {
        username,
        password
      }
    })
    if (user) {
      return {
        access_token: await this.jwtService.signAsync({ id: user.id, username }),
      }
    }
  }
}
