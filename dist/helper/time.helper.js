"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeToMinuteHour = void 0;
const timeToMinuteHour = (time) => {
    let [hour, minute] = time.split(":");
    hour = `${parseInt(hour)}`;
    minute = `${parseInt(minute)}`;
    return [hour, minute];
};
exports.timeToMinuteHour = timeToMinuteHour;
//# sourceMappingURL=time.helper.js.map