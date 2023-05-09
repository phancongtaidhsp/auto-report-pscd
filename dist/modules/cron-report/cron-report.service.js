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
exports.CronReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cron_report_model_1 = require("../../models/cron-report.model");
const typeorm_2 = require("typeorm");
const cron_report_entity_1 = require("../../entities/cron-report.entity");
const report_entity_1 = require("../../entities/report.entity");
const cron_1 = require("cron");
const puppeteer_1 = require("puppeteer");
const auth_service_1 = require("../auth/auth.service");
const user_entity_1 = require("../../entities/user.entity");
const time_helper_1 = require("../../helper/time.helper");
let CronReportService = class CronReportService {
    constructor(cronReportRepository, reportRepository, userRepository, authService) {
        this.cronReportRepository = cronReportRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.authService = authService;
        this.cronReportList = [];
        this.runCron = (cron) => {
            if (cron) {
                let range = null;
                const { time_end } = cron.report;
                const [hour, minute] = (0, time_helper_1.timeToMinuteHour)(time_end);
                if (cron.type === cron_report_model_1.CronType.WEEKLY) {
                    range = `${minute} ${hour} * * ${cron.dayofweek}`;
                }
                else {
                    range = `${minute} ${hour} * * 1,2,3,4,5`;
                }
                const cronIndex = this.cronReportList.findIndex((c) => c.id === cron.id);
                if (cronIndex >= 0) {
                    this.cronReportList[cronIndex].job.stop();
                    this.cronReportList = [...this.cronReportList.slice(0, cronIndex), ...this.cronReportList.slice(cronIndex + 1)];
                }
                const job = new cron_1.CronJob(range, () => {
                    console.log(`cron with id: ${cron.id} is running`);
                    this.createReportPuppeteer(cron.id);
                }, null, true, "Asia/Ho_Chi_Minh");
                job.start();
                this.cronReportList.push({
                    id: cron.id,
                    job
                });
            }
        };
    }
    async onModuleInit() {
        const crons = await this.cronReportRepository.find({
            where: {
                active: true
            },
            relations: ['report', 'report.user']
        });
        for (const c of crons) {
            this.runCron(c);
        }
    }
    async createReportPuppeteer(cronReportId) {
        const cron = await this.cronReportRepository.findOne({
            where: {
                id: cronReportId,
                active: true
            },
            relations: ['report', 'report.user']
        });
        const { project_name, time_start, working_time, time_end, job, status, note } = cron.report;
        const user = cron.report.user;
        const browser = await puppeteer_1.default.launch({
            headless: "new",
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ['--enable-automation'],
            args: [
                `--window-size=1280,1024`,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
            ],
        });
        const page = await browser.newPage();
        await this.authService.loginPuppeteer(page, user);
        await page.goto('http://reports.pscds.com/reports/add');
        await page.waitForSelector('#project_id');
        const projectValue = await page.evaluate((project_name) => {
            const projectOptionEls = Array.from(document.querySelectorAll("#project_id option"));
            const projectEl = projectOptionEls.find((e) => e.textContent === project_name);
            if (projectEl) {
                return Promise.resolve(projectEl.value);
            }
            return Promise.resolve(false);
        }, project_name);
        await page.select("#project_id", projectValue);
        await page.waitForTimeout(800);
        await page.click("#time_start", { count: 3 });
        await page.waitForTimeout(800);
        await page.type("#time_start", time_start, { delay: 30 });
        await page.waitForTimeout(800);
        await page.click("#work_time", { count: 3 });
        await page.waitForTimeout(800);
        await page.type("#work_time", working_time, { delay: 30 });
        await page.waitForTimeout(800);
        await page.click("#time_end", { count: 3 });
        await page.waitForTimeout(800);
        await page.type("#time_end", time_end, { delay: 30 });
        await page.waitForTimeout(800);
        await page.type("#job", job, { delay: 30 });
        await page.waitForTimeout(800);
        await page.select("#input-status", status);
        await page.waitForTimeout(800);
        await page.type("#notes", note, { delay: 30 });
        await page.waitForTimeout(800);
        await page.click("#btn_add");
        await page.waitForSelector(".box-body");
        await page.waitForTimeout(800);
    }
    async createCronReport(userId, cronReport, report) {
        const canCreate = await this.canCreateOrUpdateCronReport(userId, cronReport);
        if (canCreate) {
            const reportCreated = await this.reportRepository.save(Object.assign(Object.assign({}, report), { user: userId }));
            const cronReportCreated = await this.cronReportRepository.save(Object.assign(Object.assign({}, cronReport), { report: reportCreated.id }));
            const cron = await this.cronReportRepository.findOne({
                where: {
                    active: true,
                    id: cronReportCreated.id
                },
                relations: ['report', 'report.user']
            });
            this.runCron(cron);
            return true;
        }
        return false;
    }
    async updateCronReport(userId, cronReport, report) {
        const canUpdate = await this.canCreateOrUpdateCronReport(userId, cronReport);
        if (canUpdate) {
            if (cronReport === null || cronReport === void 0 ? void 0 : cronReport.id) {
                await this.cronReportRepository.update(cronReport.id, Object.assign(Object.assign(Object.assign({}, (cronReport.active !== undefined && { active: cronReport.active })), (cronReport.type !== undefined && { type: cronReport.type })), (cronReport.dayofweek !== undefined && { dayofweek: cronReport.dayofweek })));
            }
            if (report === null || report === void 0 ? void 0 : report.id) {
                await this.reportRepository.update(report.id, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (report.project_name !== undefined && { project_name: report.project_name })), (report.time_start !== undefined && { time_start: report.time_start })), (report.working_time !== undefined && { working_time: report.working_time })), (report.time_end !== undefined && { time_end: report.time_end })), (report.status !== undefined && { status: report.status })), (report.job !== undefined && { job: report.job })), (report.note !== undefined && { note: report.note })));
            }
            if (cronReport === null || cronReport === void 0 ? void 0 : cronReport.id) {
                const cron = await this.cronReportRepository.findOne({
                    where: {
                        active: true,
                        id: cronReport.id
                    },
                    relations: ['report', 'report.user']
                });
                this.runCron(cron);
            }
            if (!(cronReport === null || cronReport === void 0 ? void 0 : cronReport.id) && (report === null || report === void 0 ? void 0 : report.id)) {
                const reportFound = await this.reportRepository.findOne({
                    where: {
                        id: report.id
                    },
                    relations: ['cronReports']
                });
                if (reportFound === null || reportFound === void 0 ? void 0 : reportFound.cronReports) {
                    for (const r of reportFound.cronReports) {
                        const crons = await this.cronReportRepository.find({
                            where: {
                                active: true,
                                id: r.id
                            },
                            relations: ['report', 'report.user']
                        });
                        for (const cron of crons) {
                            this.runCron(cron);
                        }
                    }
                }
            }
            return true;
        }
        return false;
    }
    async canCreateOrUpdateCronReport(userId, cronReport) {
        var _a;
        if (cronReport) {
            const userReport = await this.userRepository.findOne({
                where: {
                    id: userId
                },
                relations: ['reports.cronReports']
            });
            let crons = [];
            for (const report of userReport.reports) {
                crons = [...crons, ...report.cronReports];
            }
            crons = crons.filter(c => c.active);
            if (cronReport.id) {
                crons = crons.filter(c => c.id !== cronReport.id);
            }
            if (cronReport.type === cron_report_model_1.CronType.DAILY && crons.length > 0) {
                return false;
            }
            if (cronReport.type === cron_report_model_1.CronType.WEEKLY) {
                const dayofweekArray = cronReport.dayofweek.split(",");
                for (const cron of crons) {
                    if (cron.type === cron_report_model_1.CronType.DAILY) {
                        return false;
                    }
                    for (const day of dayofweekArray) {
                        if (cron.dayofweek && ((_a = cron.dayofweek) === null || _a === void 0 ? void 0 : _a.includes(day))) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
};
CronReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cron_report_entity_1.CronReportEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(report_entity_1.ReportEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], CronReportService);
exports.CronReportService = CronReportService;
//# sourceMappingURL=cron-report.service.js.map