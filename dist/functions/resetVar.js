"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variableType = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const database_1 = require("../utils/database");
var variableType;
(function (variableType) {
    variableType["global"] = "global";
    variableType["user"] = "user";
    variableType["member"] = "member";
    variableType["guild"] = "guild";
    variableType["channel"] = "channel";
    variableType["role"] = "role";
    variableType["message"] = "message";
})(variableType || (exports.variableType = variableType = {}));
exports.default = new forgescript_1.NativeFunction({
    name: "$resetVar",
    version: "1.0.0",
    description: "...",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Variable type",
            type: forgescript_1.ArgType.Enum,
            enum: variableType,
            required: true,
            rest: false
        },
        {
            name: "reset",
            description: "Reset type",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "id",
            description: "Entity ID",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [type, reset, id]) {
        (0, database_1.resetVar)(type, reset, String(id));
        return this.success();
    },
});
//# sourceMappingURL=resetVar.js.map