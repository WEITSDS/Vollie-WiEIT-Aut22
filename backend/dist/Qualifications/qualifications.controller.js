"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQualificationById = exports.updateQualificationById = exports.getOwnQualifications = exports.getQualificationsForUserId = exports.createQualification = void 0;
var tslib_1 = require("tslib");
var tslog_1 = require("tslog");
var utility_1 = require("../utility");
var cloudinary_1 = require("cloudinary");
var constants_1 = require("../constants");
var qualifications_interface_1 = require("./qualifications.interface");
var qualification_model_1 = tslib_1.__importDefault(require("./qualification.model"));
var user_model_1 = tslib_1.__importDefault(require("../User/user.model"));
var mongoose_1 = tslib_1.__importDefault(require("mongoose"));
var user_controller_1 = require("../User/user.controller");
cloudinary_1.v2.config(constants_1.CLOUDINARY_CONFIG);
var logger = new tslog_1.Logger({ name: "qualifications.controller" });
var createQualification = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var newQualification, user, uploadResponse, qual, err_1;
    var _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                newQualification = req.body;
                if (!(0, qualifications_interface_1.isIBasicQualification)(newQualification)) {
                    res.status(400).json({ message: "New qualification request body not in expected format", success: false });
                    return [2];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                return [4, (newQualification.user && ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.isAdmin)
                        ? user_model_1.default.findById(newQualification.user)
                        : (0, user_controller_1.getUserByEmail)(((_b = req.session.user) === null || _b === void 0 ? void 0 : _b.email) || ""))];
            case 2:
                user = _c.sent();
                if (!user) {
                    res.status(404).json({ message: "User not found", success: false });
                    return [2];
                }
                return [4, cloudinary_1.v2.uploader.upload(newQualification.filePath, {
                        upload_preset: "ml_default",
                    })];
            case 3:
                uploadResponse = _c.sent();
                qual = new qualification_model_1.default({
                    title: newQualification.title,
                    description: newQualification.description,
                    filePath: uploadResponse.secure_url,
                    fileId: uploadResponse.public_id,
                });
                qual.id = new mongoose_1.default.Types.ObjectId();
                return [4, user.update({ $push: { qualifications: qual._id } })];
            case 4:
                _c.sent();
                return [4, Promise.all([qual.save(), user.save()])];
            case 5:
                _c.sent();
                res.status(200).json({ message: "Created qualification successfully", success: true });
                return [3, 7];
            case 6:
                err_1 = _c.sent();
                (0, utility_1.handleError)(logger, res, err_1, "An unexpected error occured");
                return [3, 7];
            case 7: return [2];
        }
    });
}); };
exports.createQualification = createQualification;
var getQualificationsForUserId = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, getQualificationsForUser(user_model_1.default.findById(req.params.id).exec(), res)];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
exports.getQualificationsForUserId = getQualificationsForUserId;
var getOwnQualifications = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, getQualificationsForUser((0, user_controller_1.getUserByEmail)(((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.email) || ""), res)];
            case 1:
                _b.sent();
                return [2];
        }
    });
}); };
exports.getOwnQualifications = getOwnQualifications;
var getQualificationsForUser = function (userPromise, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var currentUser, qualifications, err_2;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4, userPromise];
            case 1:
                currentUser = _a.sent();
                if (!currentUser) {
                    res.status(404).json({ message: "Could not find user", success: false });
                    return [2];
                }
                return [4, qualification_model_1.default.find({ _id: { $in: currentUser.qualifications } })];
            case 2:
                qualifications = _a.sent();
                res.status(200).json({
                    message: "Got qualifications for current user successfully",
                    data: qualifications.map(qualifications_interface_1.mapQualificationToQualificationSummary),
                    success: true,
                });
                return [3, 4];
            case 3:
                err_2 = _a.sent();
                (0, utility_1.handleError)(logger, res, err_2, "An unexpected error occured");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
var updateQualificationById = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var qualificationFields, qualification, err_3;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                qualificationFields = req.body;
                if (!(0, qualifications_interface_1.isIBasicQualification)(qualificationFields)) {
                    res.status(400).json({ message: "Update qualification request body was not valid", success: false });
                    return [2];
                }
                return [4, qualification_model_1.default.findById(req.params.id)];
            case 1:
                qualification = _a.sent();
                if (!qualification) {
                    res.status(404).json({
                        message: "Could not find matching tag",
                        success: false,
                    });
                    return [2];
                }
                qualification.title = qualificationFields.title;
                qualification.description = qualificationFields.description;
                return [4, qualification.save()];
            case 2:
                _a.sent();
                res.status(200).json({
                    message: "Updated qualification",
                    data: (0, qualifications_interface_1.mapQualificationToQualificationSummary)(qualification),
                    success: true,
                });
                return [3, 4];
            case 3:
                err_3 = _a.sent();
                (0, utility_1.handleError)(logger, res, err_3, "Update qualification failed");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.updateQualificationById = updateQualificationById;
var deleteQualificationById = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var qual, err_4;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4, qualification_model_1.default.findById(req.params.id)];
            case 1:
                qual = _a.sent();
                if (!qual) {
                    res.status(404).json({
                        message: "Could not find matching qualification",
                        success: false,
                    });
                    return [2];
                }
                return [4, cloudinary_1.v2.uploader.destroy(qual.fileId)];
            case 2:
                _a.sent();
                return [4, qual.remove()];
            case 3:
                _a.sent();
                return [4, user_model_1.default.updateOne({ _id: qual.user }, { $pull: { qualifications: qual.id } })];
            case 4:
                _a.sent();
                res.status(200).json({
                    message: "Deleted qualification",
                    data: (0, qualifications_interface_1.mapQualificationToQualificationSummary)(qual),
                    success: true,
                });
                return [3, 6];
            case 5:
                err_4 = _a.sent();
                (0, utility_1.handleError)(logger, res, err_4, "Delete qualification failed");
                return [3, 6];
            case 6: return [2];
        }
    });
}); };
exports.deleteQualificationById = deleteQualificationById;
//# sourceMappingURL=qualifications.controller.js.map