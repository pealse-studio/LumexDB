"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLog = consoleLog;
function consoleLog(title, text) {
    const options = {
        timeZone: "Europe/Kiev",
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const now = new Date().toLocaleString('uk-UA', options);
    console.log(`- \x1b[33m[${now}]\x1b[36m (${title}) \x1b[32m${text}`);
}
//# sourceMappingURL=common.js.map