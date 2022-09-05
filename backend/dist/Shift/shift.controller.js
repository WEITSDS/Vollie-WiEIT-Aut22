"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.assignUser = exports.deleteShift = exports.createShift = void 0;
var tslib_1 = require("tslib");
var user_model_1 = tslib_1.__importDefault(require("../User/user.model"));
var Shift_model_1 = tslib_1.__importDefault(require("./Shift.model"));
var mongoose_1 = tslib_1.__importDefault(require("mongoose"));
var tslog_1 = require("tslog");
var utility_1 = require("../utility");
var shift_interface_1 = require("./shift.interface");
var logger = new tslog_1.Logger({ name: "shift.controller" });
var createShift = function (req, res) {
    var _a;
    var isAdmin = ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.isAdmin) || false;
    if (req.params.id && !isAdmin) {
        res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
        return;
    }
    var shiftFields = req.body;
    if (!(0, shift_interface_1.isIBasicShift)(shiftFields)) {
        res.status(400).json({ message: "New shift request body was not valid", success: false });
        return;
    }
    Shift_model_1.default.findOne({ name: shiftFields.name })
        .exec()
        .then(function (existingShift) {
        if (existingShift) {
            logger.warn(existingShift);
            res.json({
                message: "Shift already exists",
                status: false,
            });
        }
        var newShift = new Shift_model_1.default({
            name: shiftFields.name,
            status: shiftFields.status,
            startAt: shiftFields.startAt,
            endAt: shiftFields.endAt,
            hours: shiftFields.hours,
            address: shiftFields.address,
            description: shiftFields.description,
        });
        newShift.id = new mongoose_1.default.Types.ObjectId();
        logger.info(newShift);
        newShift
            .save()
            .then(function (results) {
            return res.status(200).json({
                message: "Shift created",
                data: (0, shift_interface_1.mapShiftToShiftSummary)(results),
                success: true,
            });
        })
            .catch(function (err) {
            (0, utility_1.handleError)(logger, res, err, "Shift creation failed");
        });
    })
        .catch(function (err) {
        (0, utility_1.handleError)(logger, res, err, "Shift creation failed");
    });
};
exports.createShift = createShift;
var deleteShift = function (req, res) {
    var _a;
    var isAdmin = ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.isAdmin) || false;
    if (!req.params.id && isAdmin) {
        Shift_model_1.default.deleteOne({ _id: req.params })
            .exec()
            .then(function (deletionResult) {
            if (deletionResult.acknowledged && deletionResult.deletedCount > 0) {
                return res.status(200).json({
                    message: "Shift deleted",
                    success: true,
                });
            }
            else {
                return res.status(404).json({
                    message: "Shift id not found",
                    success: false,
                });
            }
        })
            .catch(function (err) {
            (0, utility_1.handleError)(logger, res, err, "Shift deletion failed");
        });
    }
};
exports.deleteShift = deleteShift;
var assignUser = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var userId;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = "test";
                return [4, Shift_model_1.default.findOneAndUpdate({ _id: req.params.shiftid }, { $addToSet: { users: userId } })
                        .exec()
                        .then(function (assignUserResponse) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!assignUserResponse) return [3, 2];
                                    return [4, user_model_1.default.findOneAndUpdate({ _id: userId }, { $addToSet: { shifts: req.params.shiftid } })
                                            .exec()
                                            .then(function (assignShiftResponse) {
                                            if (assignShiftResponse) {
                                                return res.status(200).json({
                                                    message: "User assigned to shift",
                                                    success: true,
                                                });
                                            }
                                            else {
                                                return res.status(404).json({
                                                    message: "User not found",
                                                    success: true,
                                                });
                                            }
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
exports.assignUser = assignUser;
var removeUser = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var userId;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = "test";
                return [4, Shift_model_1.default.findOneAndUpdate({ _id: req.params.shiftid }, { $pull: { users: userId } })
                        .exec()
                        .then(function (assignUserResponse) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!assignUserResponse) return [3, 2];
                                    return [4, user_model_1.default.findOneAndUpdate({ _id: userId }, { $pull: { shifts: req.params.shiftid } })
                                            .exec()
                                            .then(function (assignShiftResponse) {
                                            if (assignShiftResponse) {
                                                return res.status(200).json({
                                                    message: "User removed from shift",
                                                    success: true,
                                                });
                                            }
                                            else {
                                                return res.status(404).json({
                                                    message: "User not found",
                                                    success: true,
                                                });
                                            }
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
exports.removeUser = removeUser;
//# sourceMappingURL=shift.controller.js.map