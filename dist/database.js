"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVar = setVar;
exports.deleteVar = deleteVar;
exports.getVar = getVar;
exports.toggleVar = toggleVar;
exports.resetVar = resetVar;
exports.optimizationVar = optimizationVar;
exports.updateVar = updateVar;
const fs_1 = require("fs");
const { promises: fs } = require('fs');
const path_1 = require("path");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const files = (0, path_1.join)("/home/container/LumexDB/files");
const types = ["global", "user", "member", "guild", "channel", "role", "message"];
let variables;
function setVar(type, name, value, id) {
    const path = (0, path_1.join)(files, type);
    if (!(0, fs_1.existsSync)(path))
        return;
    const key = type === "global" ? name : id;
    const db = new better_sqlite3_1.default(path);
    try {
        const row = db.prepare(`SELECT value FROM data WHERE id = ?`).get(key);
        if (!value) {
            if (row) {
                if (type === "global") {
                    db.prepare(`DELETE FROM data WHERE id = ?`).run(key);
                }
                else {
                    const data = JSON.parse(row.value);
                    delete data[name];
                    if (Object.keys(data).length === 0) {
                        db.prepare(`DELETE FROM data WHERE id = ?`).run(key);
                    }
                    else {
                        db.prepare(`UPDATE data SET value = ? WHERE id = ?`).run(JSON.stringify(data), key);
                    }
                }
            }
            return;
        }
        if (type === "global") {
            db.prepare(`INSERT INTO data (id, value) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET value = ?`).run(key, value, value);
        }
        else {
            const data = row ? JSON.parse(row.value) : {};
            data[name] = value;
            const updatedData = JSON.stringify(data);
            if (row) {
                db.prepare(`UPDATE data SET value = ? WHERE id = ?`).run(updatedData, key);
            }
            else {
                db.prepare(`INSERT INTO data (id, value) VALUES (?, ?)`).run(key, updatedData);
            }
        }
    }
    catch (error) {
        consoleLog("LumexDB | setVar", error);
    }
    finally {
        db.close();
    }
}
function deleteVar(type, name, id) {
    const path = (0, path_1.join)(files, type);
    if (!(0, fs_1.existsSync)(path))
        return;
    const key = type === "global" ? name : id;
    const db = new better_sqlite3_1.default(path);
    try {
        const row = db.prepare(`SELECT value FROM data WHERE id = ?`).get(key);
        if (!row)
            return;
        if (type === "global") {
            db.prepare(`DELETE FROM data WHERE id = ?`).run(key);
        }
        else {
            const data = JSON.parse(row.value);
            delete data[name];
            if (Object.keys(data).length === 0) {
                db.prepare(`DELETE FROM data WHERE id = ?`).run(key);
            }
            else {
                db.prepare(`UPDATE data SET value = ? WHERE id = ?`).run(JSON.stringify(data), key);
            }
        }
    }
    catch (error) {
        consoleLog("LumexDB | deleteVar", error);
    }
    finally {
        db.close();
    }
}
function getVar(type, name, id) {
    const path = (0, path_1.join)(files, type);
    const value = variables[name];
    if (!(0, fs_1.existsSync)(path))
        return value;
    const db = new better_sqlite3_1.default(path);
    try {
        const row = db.prepare('SELECT value FROM data WHERE id = ?').get(type === "global" ? name : id);
        if (!row)
            return value;
        if (type === "global")
            return row.value || value;
        return JSON.parse(row.value)[name] ?? value;
    }
    catch (error) {
        consoleLog("LumexDB | getVar", error);
    }
    finally {
        db.close();
    }
}
function toggleVar(type, name, id) {
    const path = (0, path_1.join)(files, type);
    if (!(0, fs_1.existsSync)(path))
        return;
    const key = type === "global" ? name : id;
    const db = new better_sqlite3_1.default(path);
    try {
        const row = db.prepare('SELECT value FROM data WHERE id = ?').get(key);
        let result;
        if (!row) {
            result = true;
            const value = type === "global" ? "true" : JSON.stringify({ [name]: true });
            db.prepare('INSERT INTO data (id, value) VALUES (?, ?)').run(key, value);
        }
        else {
            if (type === "global") {
                result = !(row.value === "true");
                db.prepare('UPDATE data SET value = ? WHERE id = ?').run(result.toString(), key);
            }
            else {
                const data = JSON.parse(row.value);
                result = typeof data[name] === 'boolean' ? !data[name] : true;
                data[name] = result;
                db.prepare('UPDATE data SET value = ? WHERE id = ?').run(JSON.stringify(data), key);
            }
        }
        return result;
    }
    catch (error) {
        consoleLog("LumexDB | toggleVar", error);
    }
    finally {
        db.close();
    }
}
async function resetVar(type, reset, id) {
    const path = (0, path_1.join)(files, type);
    if (!(0, fs_1.existsSync)(path))
        return;
    try {
        if (reset === "all") {
            await fs.unlink(path);
            createFiles();
        }
        if (reset === "data") {
            if (type === "global")
                return;
            if (!id)
                return;
            const db = new better_sqlite3_1.default(path);
            db.prepare(`DELETE FROM data WHERE id = ?`).run(id);
            db.close();
        }
    }
    catch (error) {
        consoleLog("LumexDB | resetVar", error);
    }
}
function optimizationVar() {
    let optimizedCount = 0;
    types.forEach(file => {
        const path = (0, path_1.join)(files, file);
        if ((0, fs_1.existsSync)(path)) {
            const db = new better_sqlite3_1.default(path);
            try {
                db.pragma('vacuum');
                db.pragma('analyze');
                db.pragma('optimize');
                db.pragma('wal_checkpoint(FULL)');
                optimizedCount++;
            }
            catch (error) {
                consoleLog("LumexDB", `Error during optimization (${file}): ${error}`);
            }
            finally {
                db.close();
            }
        }
    });
    consoleLog("LumexDB", `Optimization completed ${optimizedCount}/${types.length} files optimized successfully.`);
}
function updateVar() {
    if (!(0, fs_1.existsSync)(files))
        (0, fs_1.mkdirSync)(files, { recursive: true });
    const variablesPath = (0, path_1.join)("/home/container/LumexDB/variables.json");
    if (!(0, fs_1.existsSync)(variablesPath))
        (0, fs_1.writeFileSync)(variablesPath, "{}");
    try {
        const data = JSON.parse((0, fs_1.readFileSync)(variablesPath, "utf8"));
        if (typeof data === 'object' && data !== null) {
            variables = data;
        }
    }
    catch (error) {
        console.error("LumexDB | updateVar", error);
    }
    finally {
        createFiles();
    }
}
function createFiles() {
    types.forEach(dbFile => {
        const dbPath = (0, path_1.join)(files, dbFile);
        if (!(0, fs_1.existsSync)(dbPath)) {
            const db = new better_sqlite3_1.default(dbPath);
            db.exec(`CREATE TABLE IF NOT EXISTS data (id TEXT PRIMARY KEY, value TEXT)`);
            db.prepare(`CREATE INDEX IF NOT EXISTS idx_data_id ON data (id)`).run();
            db.pragma('journal_mode = WAL');
            db.close();
        }
    });
}
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
//# sourceMappingURL=database.js.map
