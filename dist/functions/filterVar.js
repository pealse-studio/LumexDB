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
    name: "$filterVar",
    version: "1.0.0",
    description: "...",
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Variable type",
            type: forgescript_1.ArgType.Enum,
            enum: variableType,
            rest: false
        },
        {
            name: "name",
            description: "Variable name",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "value",
            description: "New value",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "id",
            description: "Entity ID",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "guild",
            description: "Guild ID",
            type: forgescript_1.ArgType.Guild,
            rest: false
        }
    ],
    execute(ctx, [type, name, value, id, guild]) {
        return this.success((0, database_1.filterVar)(String(type), String(name), String(value), String(id), String(guild)));
    },
});
//# sourceMappingURL=filterVar.js.map