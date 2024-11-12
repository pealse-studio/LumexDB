"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetType = exports.variableType = void 0;
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
var resetType;
(function (resetType) {
    resetType["all"] = "all";
    resetType["data"] = "data";
})(resetType || (exports.resetType = resetType = {}));
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
            type: forgescript_1.ArgType.Enum,
            enum: resetType,
            required: true,
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
    execute(ctx, [type, reset, id, guild]) {
        if (type === "global") {
            (0, database_1.resetVar)(type, String(reset));
            return this.success();
        }
        ;
        let key = id || ctx[type]?.id;
        if (["member", "channel", "role", "message"].includes(type)) {
            key = `${key}-${guild?.id || ctx.guild.id}`;
        }
        ;
        (0, database_1.resetVar)(type, String(reset), key);
        return this.success();
    },
});
//# sourceMappingURL=resetVar.js.map