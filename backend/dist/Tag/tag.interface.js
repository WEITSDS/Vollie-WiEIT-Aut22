"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTagToTagSummary = exports.isIBasicTag = void 0;
function isIBasicTag(args) {
    var partial = args;
    return typeof partial === "object" && typeof partial.name === "string" && typeof partial.description === "string";
}
exports.isIBasicTag = isIBasicTag;
function convertTagToTagSummary(t) {
    return { _id: t._id || "", name: t.name, description: t.description, userCount: t.users.length };
}
exports.convertTagToTagSummary = convertTagToTagSummary;
//# sourceMappingURL=tag.interface.js.map