import { CronType } from 'src/models/cron-report.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReportEntity } from './report.entity';

@Entity()
export class CronReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: CronType;

  @Column()
  active: boolean;

  @Column({ nullable: true })
  dayofweeks: string;

  @ManyToOne(() => ReportEntity, (report) => report.id)
  report: number;
}