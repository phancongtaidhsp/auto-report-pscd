export enum CronType {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY"
}

export class CronReportModel {
  id?: number;
  type: CronType;
  active: boolean;
  dayofweek?: string;
  report?: number;
}