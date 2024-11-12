import { ArgType, NativeFunction } from "@tryforge/forgescript";
export declare enum variableType {
    global = "global",
    user = "user",
    member = "member",
    guild = "guild",
    channel = "channel",
    role = "role",
    message = "message"
}
export declare enum resetType {
    all = "all",
    data = "data"
}
declare const _default: NativeFunction<[{
    name: string;
    description: string;
    type: ArgType.Enum;
    enum: typeof variableType;
    required: true;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.Enum;
    enum: typeof resetType;
    required: true;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.String;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.Guild;
    rest: false;
}], true>;
export default _default;
//# sourceMappingURL=resetVar.d.ts.map