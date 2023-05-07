import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CronReportEntity } from './cron-report.entity';
import { UserEntity } from './user.entity';

@Entity()
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_name: string;

  @Column()
  time_start: string;

  @Column()
  working_time: string;

  @Column()
  time_end: string;

  @Column({ nullable: true })
  job: string;

  @Column({ default: true })
  status: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: number;

  @OneToMany(() => CronReportEntity, (cronReport) => cronReport.report)
  cronReports: CronReportEntity[];
}