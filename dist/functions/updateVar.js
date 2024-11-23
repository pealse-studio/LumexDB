"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const database_1 = require("../database");
exports.default = new forgescript_1.NativeFunction({
    name: "$updateVar",
    version: "1.0.0",
    description: "Updates the variable in the database based on the current state of the variables cache",
    unwrap: true,
    execute(ctx) {
        (0, database_1.updateVar)();
        return this.success();
    }
});
//# sourceMappingURL=updateVar.js.map