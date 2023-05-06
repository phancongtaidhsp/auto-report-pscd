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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronReportEntity = void 0;
const cron_report_model_1 = require("../models/cron-report.model");
const typeorm_1 = require("typeorm");
const report_entity_1 = require("./report.entity");
let CronReportEntity = class CronReportEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CronReportEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CronReportEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], CronReportEntity.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CronReportEntity.prototype, "dayofweeks", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => report_entity_1.ReportEntity, (report) => report.id),
    __metadata("design:type", Number)
], CronReportEntity.prototype, "report", void 0);
CronReportEntity = __decorate([
    (0, typeorm_1.Entity)()
], CronReportEntity);
exports.CronReportEntity = CronReportEntity;
//# sourceMappingURL=cron-report.entity.js.map