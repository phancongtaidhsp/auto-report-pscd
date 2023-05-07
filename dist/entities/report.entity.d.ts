import { CronReportEntity } from './cron-report.entity';
export declare class ReportEntity {
    id: number;
    project_name: string;
    time_start: string;
    working_time: string;
    time_end: string;
    job: string;
    status: string;
    note: string;
    user: number;
    cronReport: CronReportEntity;
}
