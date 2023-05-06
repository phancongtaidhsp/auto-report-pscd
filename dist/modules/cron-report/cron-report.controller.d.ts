import { CronReportService } from './cron-report.service';
import { UserModel } from 'src/models/user.model';
import { CronReportModel } from 'src/models/cron-report.model';
import { ReportModel } from 'src/models/report.model';
export declare class CronReportController {
    private readonly cronReportService;
    constructor(cronReportService: CronReportService);
    createCronReport(user: UserModel, cronReport: CronReportModel, report: ReportModel): Promise<any>;
}
