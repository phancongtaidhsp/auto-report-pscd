import { Module } from '@nestjs/common';
import { CronReportService } from './cron-report.service';
import { CronReportController } from './cron-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronReportEntity } from 'src/entities/cron-report.entity';
import { ReportEntity } from 'src/entities/report.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' },
      })
    }),
    TypeOrmModule.forFeature([CronReportEntity, ReportEntity]),
    AuthModule
  ],
  providers: [CronReportService],
  controllers: [CronReportController]
})
export class CronReportModule {}
