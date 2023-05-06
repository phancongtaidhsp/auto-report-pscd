export declare enum CronType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY"
}
export declare class CronReportModel {
    id?: number;
    type: CronType;
    active: boolean;
    dayofweek?: string;
    report?: number;
}
