"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronReportModule = void 0;
const common_1 = require("@nestjs/common");
const cron_report_service_1 = require("./cron-report.service");
const cron_report_controller_1 = require("./cron-report.controller");
const typeorm_1 = require("@nestjs/typeorm");
const cron_report_entity_1 = require("../../entities/cron-report.entity");
const report_entity_1 = require("../../entities/report.entity");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("../auth/auth.module");
let CronReportModule = class CronReportModule {
};
CronReportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: () => ({
                    global: true,
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '24h' },
                })
            }),
            typeorm_1.TypeOrmModule.forFeature([cron_report_entity_1.CronReportEntity, report_entity_1.ReportEntity]),
            auth_module_1.AuthModule
        ],
        providers: [cron_report_service_1.CronReportService],
        controllers: [cron_report_controller_1.CronReportController]
    })
], CronReportModule);
exports.CronReportModule = CronReportModule;
//# sourceMappingURL=cron-report.module.js.map