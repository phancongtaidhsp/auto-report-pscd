import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReportEntity } from './report.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => ReportEntity, (report) => report.user)
  reports: ReportEntity[]
}