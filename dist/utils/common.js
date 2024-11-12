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
    console.log(`- \x1b[38;5;146m[${now}]\x1b[38;5;15m (${title}) \x1b[38;5;187m${text}\x1b[0m`);
}
//# sourceMappingURL=common.js.map