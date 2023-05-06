import { OnModuleInit } from '@nestjs/common';
import { CronReportModel } from 'src/models/cron-report.model';
import { Repository } from 'typeorm';
import { ReportModel } from 'src/models/report.model';
import { UserModel } from 'src/models/user.model';
import { AuthService } from '../auth/auth.service';
export declare class CronReportService implements OnModuleInit {
    private cronReportRepository;
    private reportRepository;
    private authService;
    cronReportList: any[];
    constructor(cronReportRepository: Repository<CronReportModel>, reportRepository: Repository<ReportModel>, authService: AuthService);
    onModuleInit(): Promise<void>;
    createCron(user: UserModel, report: ReportModel): Promise<void>;
    createCronReport(userId: number, cronReport: CronReportModel, report: ReportModel): Promise<void>;
    deactiveCronRepor(cronReportId: number): Promise<import("typeorm").UpdateResult>;
}
