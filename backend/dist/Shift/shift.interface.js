"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapShiftToShiftSummary = exports.isIBasicShift = void 0;
function isIBasicShift(args) {
    var ishift = args;
    return (typeof ishift === "object" &&
        typeof ishift.name === "string" &&
        typeof ishift.startAt === "string" &&
        typeof ishift.endAt === "string" &&
        typeof ishift.hours === "number" &&
        typeof ishift.address === "string" &&
        typeof ishift.description === "string");
}
exports.isIBasicShift = isIBasicShift;
function mapShiftToShiftSummary(_a) {
    var _id = _a._id, name = _a.name, startAt = _a.startAt, endAt = _a.endAt, hours = _a.hours, address = _a.address, description = _a.description, status = _a.status, createdAt = _a.createdAt, archivedAt = _a.archivedAt, isArchived = _a.isArchived;
    return {
        _id: _id || "",
        name: name,
        startAt: startAt,
        endAt: endAt,
        hours: hours,
        address: address,
        description: description,
        status: status,
        createdAt: createdAt,
        isArchived: isArchived,
        archivedAt: archivedAt,
    };
}
exports.mapShiftToShiftSummary = mapShiftToShiftSummary;
//# sourceMappingURL=shift.interface.js.map