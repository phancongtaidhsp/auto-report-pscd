import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CronReportModel, CronType } from 'src/models/cron-report.model';
import { Repository } from 'typeorm';
import { CronReportEntity } from 'src/entities/cron-report.entity';
import { ReportEntity } from 'src/entities/report.entity';
import { ReportModel } from 'src/models/report.model';
import { CronJob } from 'cron';
import puppeteer from 'puppeteer';
import { UserModel } from 'src/models/user.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CronReportService implements OnModuleInit {
  cronReportList: any[] = []
  constructor(
    @InjectRepository(CronReportEntity)
    private cronReportRepository: Repository<CronReportModel>,
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportModel>,
    private authService: AuthService,
  ) { }

  async onModuleInit() {
    const crons = await this.cronReportRepository.find({
      where: {
        active: true
      },
      relations: ['report', 'report.user']
    }) as any
    for (const c of crons) {
      let range = null
      if(c.type === CronType.WEEKLY) {
        range = `0 22 * * ${c.dayofweek}`
      } else {
        range = `0 22 * * *`
      }
      const job = new CronJob(
        range,
        () => {
          console.log(`cron with id: ${c.id} is running`);
          this.createCron(c.report.user, c.report)
        },
        null,
        true,
        "Asia/Singapore"
      )
      this.cronReportList.push({
        id: c.id,
        job
      })
      job.start()
    }
  }

  async createCron (user: UserModel, report: ReportModel) {
    const { project_name, times_start, working_time, time_end, job, status, note } = report
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
    await this.authService.loginPuppeteer(page, user)
    await page.goto('http://reports.pscds.com/reports/add')

    await page.waitForSelector('#project_id')
  
    const projectValue = await page.evaluate((project_name) => {
      const projectOptionEls = Array.from(document.querySelectorAll("#project_id option"))
      const projectEl = projectOptionEls.find((e) => e.textContent === project_name) as any
      if (projectEl) {
        return Promise.resolve(projectEl.value)
      }
      return Promise.resolve(false)
    }, project_name)
  
    await page.select("#project_id", projectValue)
  
    await page.waitForTimeout(800)
  
    await page.click("#time_start", { count: 3 })
  
    await page.waitForTimeout(800)
  
    await page.type("#time_start", times_start, { delay: 30 })
  
    await page.waitForTimeout(800)
  
    await page.click("#work_time", { count: 3 })
  
    await page.waitForTimeout(800)
  
    await page.type("#work_time", working_time, { delay: 30 })
  
    await page.waitForTimeout(800)
  
    await page.click("#time_end", { count: 3 })
  
    await page.waitForTimeout(800)
  
    await page.type("#time_end", time_end, { delay: 30 })
  
    await page.waitForTimeout(800)
  
    await page.type("#job", job, { delay: 30 })
  
    await page.waitForTimeout(800)
  
    await page.select("#input-status", status)
  
    await page.waitForTimeout(800)
  
    await page.type("#notes", note, { delay: 30 })
  
    await page.waitForTimeout(800)
  
    await page.click("#btn_add")
  
    await page.waitForSelector(".box-body")
  
    await page.waitForTimeout(800)

  }


  async createCronReport(userId: number, cronReport: CronReportModel, report: ReportModel) {
    const reportCreated = await this.reportRepository.save({ ...report, user: userId })
    const cronReportCreated = await this.cronReportRepository.save({ ...cronReport, report: reportCreated.id })
    const cron = await this.cronReportRepository.findOne({
      where: {
        active: true,
        id: cronReportCreated.id
      },
      relations: ['report', 'report.user']
    }) as any

    let range = null
    if(cron.type === CronType.WEEKLY) {
      range = `0 22 * * ${cron.dayofweek}`
    } else {
      range = `0 22 * * *`
    }
    const job = new CronJob(
      range,
      () => {
        console.log(`cron with id: ${cron.id} is running`);
        this.createCron(cron.report.user, cron.report)
      },
      null,
      true,
      "Asia/Singapore"
    )
    job.start()
    this.cronReportList.push({
      id: cron.id,
      job
    })
  }

  async deactiveCronRepor(cronReportId: number) {
    const cron = this.cronReportList.find(c => c.id === cronReportId)
    if(cron?.job) {
      cron.job.stop()
      return await this.cronReportRepository.update(cron.id, {
        active: false
      })
    }
  }

}
