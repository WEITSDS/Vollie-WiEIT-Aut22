"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserToUserSummary = exports.isIBasicUser = void 0;
var qualifications_interface_1 = require("../Qualifications/qualifications.interface");
var tag_interface_1 = require("../Tag/tag.interface");
function isIBasicUser(args) {
    var iuser = args;
    return (typeof iuser === "object" &&
        typeof iuser.email === "string" &&
        typeof iuser.firstName === "string" &&
        typeof iuser.lastName === "string" &&
        typeof iuser.password === "string");
}
exports.isIBasicUser = isIBasicUser;
function mapUserToUserSummary(_a) {
    var firstName = _a.firstName, lastName = _a.lastName, lastLogin = _a.lastLogin, _id = _a._id, email = _a.email, qualifications = _a.qualifications, verified = _a.verified, createdAt = _a.createdAt, isAdmin = _a.isAdmin, tags = _a.tags;
    return {
        lastLogin: lastLogin !== null && lastLogin !== void 0 ? lastLogin : 0,
        firstName: firstName,
        lastName: lastName,
        _id: _id || "",
        email: email,
        verified: verified,
        qualifications: qualifications.map(qualifications_interface_1.mapQualificationToQualificationSummary),
        registeredAt: createdAt.getTime(),
        isAdmin: isAdmin,
        tags: tags ? tags.map(tag_interface_1.convertTagToTagSummary) : [],
    };
}
exports.mapUserToUserSummary = mapUserToUserSummary;
//# sourceMappingURL=user.interface.js.map