import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards, HttpException } from '@nestjs/common';
import { CronReportService } from './cron-report.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from 'src/decorators/user.decorator';
import { UserModel } from 'src/models/user.model';
import { CronReportModel } from 'src/models/cron-report.model';
import { ReportModel } from 'src/models/report.model';

@Controller('cron-report')
export class CronReportController {
  constructor(private readonly cronReportService: CronReportService) { }

  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createCronReport(
    @AuthUser() user: UserModel,
    @Body("cron_report") cronReport: CronReportModel,
    @Body("report") report: ReportModel,
  ): Promise<void> {
    const isCreated = await this.cronReportService.createCronReport(user.id, cronReport, report)
    if(!isCreated)  {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
    }
  }

  @UseGuards(AuthGuard)
  @Post('update')
  @HttpCode(HttpStatus.OK)
  async updateCronReport(
    @AuthUser() user: UserModel,
    @Body("cron_report") cronReport?: CronReportModel,
    @Body("report") report?: ReportModel,
  ): Promise<void> {
    const isUpdated = await this.cronReportService.updateCronReport(user.id, cronReport, report)
    if(!isUpdated)  {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
    }
  }

}
