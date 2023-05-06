import { CronType } from 'src/models/cron-report.model';
export declare class CronReportEntity {
    id: number;
    type: CronType;
    active: boolean;
    dayofweeks: string;
    report: number;
}
