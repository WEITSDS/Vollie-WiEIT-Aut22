"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGenericError = void 0;
function isGenericError(args) {
    var partialPayload = args;
    return (typeof args === "object" &&
        typeof partialPayload.message === "string");
}
exports.isGenericError = isGenericError;
//# sourceMappingURL=errorMessage.js.map