import { ReportEntity } from './report.entity';
export declare class UserEntity {
    id: number;
    username: string;
    password: string;
    reports: ReportEntity[];
}
