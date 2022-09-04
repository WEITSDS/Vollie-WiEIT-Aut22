"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapShiftToShiftSummary = exports.isIBasicShift = void 0;
var user_interface_1 = require("../User/user.interface");
//var tag_interface_1 = require("../Tag/tag.interface");
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
    var name = _a.name, startAt = _a.startAt, endAt = _a.endAt, _id = _a._id, hours = _a.hours, address = _a.address, description = _a.description, createdAt = _a.createdAt, status = _a.status, users = _a.users;
    return {
        name: name,
        startAt: startAt,
        _id: _id || "",
        endAt: endAt,
        hours: hours,
        users: users.map(user_interface_1.mapUserToUserSummary),
        address: address,
        description: description,
        status: status,
    };
}
exports.mapShiftToShiftSummary = mapShiftToShiftSummary;
//# sourceMappingURL=user.interface.js.map