import { OnModuleInit } from '@nestjs/common';
import { CronReportModel } from 'src/models/cron-report.model';
import { Repository } from 'typeorm';
import { CronReportEntity } from 'src/entities/cron-report.entity';
import { ReportEntity } from 'src/entities/report.entity';
import { ReportModel } from 'src/models/report.model';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from 'src/entities/user.entity';
export declare class CronReportService implements OnModuleInit {
    private cronReportRepository;
    private reportRepository;
    private userRepository;
    private authService;
    cronReportList: any[];
    constructor(cronReportRepository: Repository<CronReportEntity>, reportRepository: Repository<ReportEntity>, userRepository: Repository<UserEntity>, authService: AuthService);
    onModuleInit(): Promise<void>;
    createReportPuppeteer(cronReportId: number): Promise<void>;
    createCronReport(userId: number, cronReport: CronReportModel, report: ReportModel): Promise<boolean>;
    runCron: (cron: any) => void;
    updateCronReport(userId: number, cronReport: CronReportModel, report: ReportModel): Promise<boolean>;
    canCreateOrUpdateCronReport(userId: number, cronReport: CronReportModel): Promise<boolean>;
}
