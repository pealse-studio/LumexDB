"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variableType = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const database_1 = require("../database");
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
    name: "$toggleVar",
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
            name: "name",
            description: "Variable name",
            type: forgescript_1.ArgType.String,
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
    execute(ctx, [type, name, id, guild]) {
        if (type === "global") {
            return this.success((0, database_1.toggleVar)(type, name));
        }
        ;
        let key = id || ctx[type]?.id;
        if (["member", "channel", "role", "message"].includes(type)) {
            key = `${key}-${guild?.id || ctx.guild.id}`;
        }
        ;
        return this.success((0, database_1.toggleVar)(type, name, String(key)));
    },
});
//# sourceMappingURL=toggleVar.js.map