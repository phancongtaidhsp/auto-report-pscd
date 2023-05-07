import { OnModuleInit } from '@nestjs/common';
import { CronReportModel } from 'src/models/cron-report.model';
import { Repository } from 'typeorm';
import { ReportModel } from 'src/models/report.model';
import { UserModel } from 'src/models/user.model';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from 'src/entities/user.entity';
export declare class CronReportService implements OnModuleInit {
    private cronReportRepository;
    private reportRepository;
    private userRepository;
    private authService;
    cronReportList: any[];
    constructor(cronReportRepository: Repository<CronReportModel>, reportRepository: Repository<ReportModel>, userRepository: Repository<UserEntity>, authService: AuthService);
    onModuleInit(): Promise<void>;
    createReportPuppeteer(user: UserModel, report: ReportModel): Promise<void>;
    createCronReport(userId: number, cronReport: CronReportModel, report: ReportModel): Promise<void>;
    canCreateCronReport(userId: number): Promise<void>;
    deactiveCronRepor(cronReportId: number): Promise<import("typeorm").UpdateResult>;
}
