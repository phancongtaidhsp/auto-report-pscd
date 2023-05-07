"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronReportController = void 0;
const common_1 = require("@nestjs/common");
const cron_report_service_1 = require("./cron-report.service");
const auth_guard_1 = require("../auth/auth.guard");
const user_decorator_1 = require("../../decorators/user.decorator");
const user_model_1 = require("../../models/user.model");
const cron_report_model_1 = require("../../models/cron-report.model");
const report_model_1 = require("../../models/report.model");
let CronReportController = class CronReportController {
    constructor(cronReportService) {
        this.cronReportService = cronReportService;
    }
    async createCronReport(user, cronReport, report) {
        const isCreated = await this.cronReportService.createCronReport(user.id, cronReport, report);
        if (!isCreated) {
            throw new common_1.HttpException('Bad request', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateCronReport(user, cronReport, report) {
        const isUpdated = await this.cronReportService.updateCronReport(user.id, cronReport, report);
        if (!isUpdated) {
            throw new common_1.HttpException('Bad request', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)("cron_report")),
    __param(2, (0, common_1.Body)("report")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.UserModel,
        cron_report_model_1.CronReportModel,
        report_model_1.ReportModel]),
    __metadata("design:returntype", Promise)
], CronReportController.prototype, "createCronReport", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)("cron_report")),
    __param(2, (0, common_1.Body)("report")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.UserModel,
        cron_report_model_1.CronReportModel,
        report_model_1.ReportModel]),
    __metadata("design:returntype", Promise)
], CronReportController.prototype, "updateCronReport", null);
CronReportController = __decorate([
    (0, common_1.Controller)('cron-report'),
    __metadata("design:paramtypes", [cron_report_service_1.CronReportService])
], CronReportController);
exports.CronReportController = CronReportController;
//# sourceMappingURL=cron-report.controller.js.map