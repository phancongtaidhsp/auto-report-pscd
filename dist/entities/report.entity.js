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
exports.ReportEntity = void 0;
const typeorm_1 = require("typeorm");
const cron_report_entity_1 = require("./cron-report.entity");
const user_entity_1 = require("./user.entity");
let ReportEntity = class ReportEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReportEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReportEntity.prototype, "project_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReportEntity.prototype, "time_start", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReportEntity.prototype, "working_time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReportEntity.prototype, "time_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReportEntity.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", String)
], ReportEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReportEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.id),
    __metadata("design:type", Number)
], ReportEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cron_report_entity_1.CronReportEntity, (user) => user.id),
    __metadata("design:type", cron_report_entity_1.CronReportEntity)
], ReportEntity.prototype, "cronReport", void 0);
ReportEntity = __decorate([
    (0, typeorm_1.Entity)()
], ReportEntity);
exports.ReportEntity = ReportEntity;
//# sourceMappingURL=report.entity.js.map