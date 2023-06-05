import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CronReportModel, CronType } from 'src/models/cron-report.model';
import { Repository } from 'typeorm';
import { CronReportEntity } from 'src/entities/cron-report.entity';
import { ReportEntity } from 'src/entities/report.entity';
import { ReportModel } from 'src/models/report.model';
import { CronJob } from 'cron';
import puppeteer from 'puppeteer';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from 'src/entities/user.entity';
import { timeToMinuteHour } from 'src/helper/time.helper';

@Injectable()
export class CronReportService implements OnModuleInit {
  cronReportList: any[] = []
  constructor(
    @InjectRepository(CronReportEntity)
    private cronReportRepository: Repository<CronReportEntity>,
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) { }

  async onModuleInit() {
    const crons = await this.cronReportRepository.find({
      where: {
        active: true
      },
      relations: ['report', 'report.user']
    })
    for (const c of crons) {
      this.runCron(c)
    }
  }

  async createReportPuppeteer(cronReportId: number) {
    const cron = await this.cronReportRepository.findOne({
      where: {
        id: cronReportId,
        active: true
      },
      relations: ['report', 'report.user']
    }) as any

    const { project_name, time_start, working_time, time_end, job, status, note } = cron.report
    const user = cron.report.user
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process'],
      executablePath: process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath()
    });
    const page = await browser.newPage();
    await this.authService.loginPuppeteer(page, user)
    await page.goto('http://reports.pscds.com/reports/add', { waitUntil: 'domcontentloaded' })

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

    await page.type("#time_start", time_start, { delay: 30 })

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

    await browser.close()

  }


  async createCronReport(userId: number, cronReport: CronReportModel, report: ReportModel) {
    const canCreate = await this.canCreateOrUpdateCronReport(userId, cronReport);
    if (canCreate) {
      const reportCreated = await this.reportRepository.save({ ...report, user: userId })
      const cronReportCreated = await this.cronReportRepository.save({ ...cronReport, report: reportCreated.id })
      const cron = await this.cronReportRepository.findOne({
        where: {
          active: true,
          id: cronReportCreated.id
        },
        relations: ['report', 'report.user']
      }) as any
      this.runCron(cron)
      return true
    }
    return false
  }

  runCron = (cron: any) => {
    if (cron) {
      let range = null
      const { time_end } = cron.report;
      const [hour, minute] = timeToMinuteHour(time_end)
      if (cron.type === CronType.WEEKLY) {
        range = `${minute} ${hour} * * ${cron.dayofweek}`
      } else {
        range = `${minute} ${hour} * * 1,2,3,4,5`
      }
      const cronIndex = this.cronReportList.findIndex((c) => c.id === cron.id)
      if (cronIndex >= 0) {
        this.cronReportList[cronIndex].job.stop()
        this.cronReportList = [...this.cronReportList.slice(0, cronIndex), ...this.cronReportList.slice(cronIndex + 1)]
      }
      const job = new CronJob(
        range,
        () => {
          console.log(`cron with id: ${cron.id} is running`);
          this.createReportPuppeteer(cron.id)
        },
        null,
        true,
        "Asia/Ho_Chi_Minh"
      )
      job.start()
      this.cronReportList.push({
        id: cron.id,
        job
      })
    }
  }

  async updateCronReport(userId: number, cronReport: CronReportModel, report: ReportModel) {
    const canUpdate = await this.canCreateOrUpdateCronReport(userId, cronReport);
    if (canUpdate) {
      if (cronReport?.id) {
        await this.cronReportRepository.update(cronReport.id, {
          ...(cronReport.active !== undefined && { active: cronReport.active }),
          ...(cronReport.type !== undefined && { type: cronReport.type }),
          ...(cronReport.dayofweek !== undefined && { dayofweek: cronReport.dayofweek }),
        })
      }
      if (report?.id) {
        await this.reportRepository.update(report.id, {
          ...(report.project_name !== undefined && { project_name: report.project_name }),
          ...(report.time_start !== undefined && { time_start: report.time_start }),
          ...(report.working_time !== undefined && { working_time: report.working_time }),
          ...(report.time_end !== undefined && { time_end: report.time_end }),
          ...(report.status !== undefined && { status: report.status }),
          ...(report.job !== undefined && { job: report.job }),
          ...(report.note !== undefined && { note: report.note }),
        })
      }
      if (cronReport?.id) {
        const cron = await this.cronReportRepository.findOne({
          where: {
            active: true,
            id: cronReport.id
          },
          relations: ['report', 'report.user']
        }) as any
        this.runCron(cron)
      }
      if (!cronReport?.id && report?.id) {
        const reportFound = await this.reportRepository.findOne({
          where: {
            id: report.id
          },
          relations: ['cronReports']
        }) as any

        if (reportFound?.cronReports) {
          for (const r of reportFound.cronReports) {
            const crons = await this.cronReportRepository.find({
              where: {
                active: true,
                id: r.id
              },
              relations: ['report', 'report.user']
            })
            for (const cron of crons) {
              this.runCron(cron)
            }
          }
        }
      }
      return true
    }
    return false
  }

  async canCreateOrUpdateCronReport(userId: number, cronReport: CronReportModel) {
    if (cronReport) {
      const userReport = await this.userRepository.findOne({
        where: {
          id: userId
        },
        relations: ['reports.cronReports']
      }) as any
      let crons: CronReportModel[] = []
      for (const report of userReport.reports) {
        crons = [...crons, ...report.cronReports]
      }
      crons = crons.filter(c => c.active)
      if (cronReport.id) {
        crons = crons.filter(c => c.id !== cronReport.id)
      }
      if (cronReport.type === CronType.DAILY && crons.length > 0) {
        return false
      }
      if (cronReport.type === CronType.WEEKLY) {
        const dayofweekArray = cronReport.dayofweek.split(",")
        for (const cron of crons) {
          if (cron.type === CronType.DAILY) {
            return false
          }
          for (const day of dayofweekArray) {
            if (cron.dayofweek && cron.dayofweek?.includes(day)) {
              return false
            }
          }
        }
      }
    }
    return true
  }

}
