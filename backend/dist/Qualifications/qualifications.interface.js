"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapQualificationToQualificationSummary = exports.isIBasicQualification = void 0;
function isIBasicQualification(args) {
    var p = args;
    return (typeof p === "object" &&
        typeof p.title === "string" &&
        typeof p.description === "string" &&
        typeof p.filePath === "string" &&
        typeof p.fileId === "string" &&
        typeof p.user === "string");
}
exports.isIBasicQualification = isIBasicQualification;
function mapQualificationToQualificationSummary(_a) {
    var _id = _a._id, title = _a.title, description = _a.description, filePath = _a.filePath;
    return { title: title, description: description, filePath: filePath, _id: _id || "" };
}
exports.mapQualificationToQualificationSummary = mapQualificationToQualificationSummary;
//# sourceMappingURL=qualifications.interface.js.map