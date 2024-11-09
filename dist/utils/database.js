"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVar = setVar;
exports.deleteVar = deleteVar;
exports.getVar = getVar;
exports.toggleVar = toggleVar;
exports.filterVar = filterVar;
exports.resetVar = resetVar;
exports.optimizationVar = optimizationVar;
exports.updateVar = updateVar;
exports.createFiles = createFiles;
const fs_1 = require("fs");
const common_1 = require("./common");
const path_1 = require("path");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const lumexPath = (0, path_1.join)("/home/container", "LumexDB");
const files = ["global.db", "user.db", "member.db", "guild.db", "channel.db", "role.db", "message.db"];
let variables;
function setVar(type, name, value, id) {
    const path = (0, path_1.join)(lumexPath, `${type}.db`);
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
        (0, common_1.consoleLog)("setVar", error);
    }
    finally {
        db.close();
    }
}
function deleteVar(type, name, id) {
    const path = (0, path_1.join)(lumexPath, `${type}.db`);
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
        (0, common_1.consoleLog)("deleteVar", error);
    }
    finally {
        db.close();
    }
}
function getVar(type, name, id) {
    const path = (0, path_1.join)(lumexPath, `${type}.db`);
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
        (0, common_1.consoleLog)("getVar", error);
    }
    finally {
        db.close();
    }
}
function toggleVar(type, name, id) {
    const path = (0, path_1.join)(lumexPath, `${type}.db`);
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
        (0, common_1.consoleLog)("toggleVar", error);
    }
    finally {
        db.close();
    }
}
function filterVar(type, name, value, id, guild) {
    const path = (0, path_1.join)(lumexPath, `${type}.db`);
    if (!(0, fs_1.existsSync)(path))
        return;
    const db = new better_sqlite3_1.default(path);
    try {
        let result = db.prepare('SELECT id, value FROM data').all();
        return JSON.stringify(result) || undefined;
    }
    catch (error) {
        (0, common_1.consoleLog)("filterVar", error);
    }
    finally {
        db.close();
    }
}
function resetVar(type, reset, id) {
    const path = (0, path_1.join)(lumexPath, `${type}.db`);
    if (!(0, fs_1.existsSync)(path))
        return;
    const db = new better_sqlite3_1.default(path);
    try {
    }
    catch (error) {
        (0, common_1.consoleLog)("resetVar", error);
    }
    finally {
        db.close();
    }
}
function optimizationVar() {
    let optimizedCount = 0;
    files.forEach(file => {
        const path = (0, path_1.join)(lumexPath, file);
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
                (0, common_1.consoleLog)("optimizationVar", `Error during optimization (${file}): ${error}`);
            }
            finally {
                db.close();
            }
        }
    });
    (0, common_1.consoleLog)("optimizationVar", `Optimization completed: ${optimizedCount}/${files.length} files optimized successfully.`);
}
function updateVar() {
    const variablesPath = (0, path_1.join)(lumexPath, "variables.json");
    if (!(0, fs_1.existsSync)(lumexPath))
        (0, fs_1.mkdirSync)(lumexPath);
    if (!(0, fs_1.existsSync)(variablesPath))
        (0, fs_1.writeFileSync)(variablesPath, "{}");
    try {
        const data = (0, fs_1.readFileSync)(variablesPath, "utf8");
        variables = JSON.parse(data) || {};
    }
    catch (error) {
        (0, common_1.consoleLog)("updateVar | variables.json", error);
    }
    createFiles();
}
function createFiles() {
    files.forEach(dbFile => {
        const dbPath = (0, path_1.join)(lumexPath, dbFile);
        if (!(0, fs_1.existsSync)(dbPath)) {
            const db = new better_sqlite3_1.default(dbPath);
            db.exec(`CREATE TABLE IF NOT EXISTS data (id TEXT PRIMARY KEY, value TEXT)`);
            db.prepare(`CREATE INDEX IF NOT EXISTS idx_data_id ON data (id)`).run();
            db.pragma('journal_mode = WAL');
            db.close();
        }
    });
}
//# sourceMappingURL=database.js.map
