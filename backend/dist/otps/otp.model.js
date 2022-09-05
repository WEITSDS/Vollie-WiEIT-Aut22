"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOTPQuery = void 0;
function isOTPQuery(args) {
    var body = args;
    return typeof body === "object" && typeof body.email === "string" && typeof body.code === "string";
}
exports.isOTPQuery = isOTPQuery;
//# sourceMappingURL=otp.model.js.map