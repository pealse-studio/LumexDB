"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LumexDB = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const database_1 = require("./database");
class LumexDB extends forgescript_1.ForgeExtension {
    name = "LumexDB";
    description = require("../package.json").description;
    version = require("../package.json").version;
    init() {
        (0, database_1.updateVar)();
        setInterval(database_1.optimizationVar, 24 * 60 * 60 * 1000);
        this.load(__dirname + '/functions');
    }
    ;
}
exports.LumexDB = LumexDB;
;
//# sourceMappingURL=index.js.map