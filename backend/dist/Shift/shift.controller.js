"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

let tslib_1 = require("tslib");
let tslog_1 = require("tslog");
let shift_model = tslib_1.__importDefault(require("./shift.model"));
let user_model = tslib_1.__importDefault(require("../User/user.model"));
let shift_interface = require("./shift.interface");
let mongoose_1 = tslib_1.__importDefault(require("mongoose"));
let ObjectID = require('mongodb').ObjectID;
let utility_1 = require("../utility");
let logger = new tslog_1.Logger({ name: "shift.controller" });

let createShift = function (req, res) {
    if (!(req.params.id) && req.session.user.isAdmin) {
        let shiftFields = req.body;
        if (!(0, shift_interface.isIBasicShift)(shiftFields)) {
            res.status(400).json({ message: "New shift request body was not valid", success: false });
            return;
        }
        shift_model.default.findOne({ name: shiftFields.name })
            .exec()
            .then(function (existingShift) {
            if (existingShift != null) {
                logger.warn(existingShift);
                res.json({
                    message: "Shift with that name already exists",
                    status: false,
                });
            }
            var newShift = new shift_model.default({
                name: shiftFields.name,
                status: shiftFields.status,
                startAt: shiftFields.startAt,
                endAt: shiftFields.endAt,
                hours: shiftFields.hours,
                address: shiftFields.address,
                addressDescription: shiftFields.addressDescription
            });
            newShift.id = new mongoose_1.default.Types.ObjectId();
            logger.info(newShift);
            newShift
                .save()
                .then(function (results) {
                return res.status(200).json({
                    message: "Shift created",
                    data: (0, shift_interface.mapShiftToShiftSummary)(results),
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
    } else {
        return res.status(401).json({
            message: "Unauthorised, admin privileges are required",
            success: false,
        });
    }
};
exports.createShift = createShift;
let deleteShift = function (req, res) {
    if (!(req.params.id) && req.session.user.isAdmin) {
        shift_model.default.deleteOne({ _id: req.params.id})
            .exec()
            .then(deletionResult => {
                console.log(deletionResult)
                if (deletionResult.acknowledged && deletionResult.deletedCount > 0) {
                    return res.status(200).json({
                        message: "Shift deleted",
                        success: true,
                    });
                } else {
                    return res.status(404).json({
                        message: "Shift id not found",
                        success: false,
                    });
                }
            })
            .catch(err => {
                (0, utility_1.handleError)(logger, res, err, "Shift deletion failed");
            })
    } else {
        return res.status(401).json({
            message: "Unauthorised, admin privileges are required",
            success: false,
        });
    }
};
exports.deleteShift = deleteShift;

let assignUser = function (req, res) {
    console.log(req.session.user)
    shift_model.default.findOneAndUpdate(
        { _id: req.params.shiftid}, 
        { $push: { users: req.session.user._id }}
        )
        .exec()
        .then(assignUserResponse => {
            if (assignUserResponse) {
                user_model.default.findOneAndUpdate(
                { _id: req.session.user._id}, 
                { $push: { shifts: req.params.shiftid }}
                )
                .exec()
                .then(assignShiftResponse => {
                    if (assignShiftResponse) {
                        return res.status(200).json({
                            message: "User assigned to shift",
                            success: true,
                        });
                    } else {
                        return res.status(404).json({
                            message: "User not found",
                            success: true,
                        });
                    }
                })
            } else {
                return res.status(404).json({
                    message: "Shift not found",
                    success: true,
                });
            }
            
        })
}
exports.assignUser = assignUser;

let removeUser = function (req, res) {
    shift_model.default.findOneAndUpdate(
        { _id: req.params.shiftid}, 
        { $pull: { users: req.session.user._id }}
        )
        .exec()
        .then(popUserResponse => {
            if (popUserResponse) {
                user_model.default.findOneAndUpdate(
                    { _id: req.session.user._id}, 
                    { $pull: { shifts: req.params.shiftid }}
                )
                .exec()
                .then(popShiftResponse => {
                    if (popShiftResponse) {
                        return res.status(404).json({
                            message: "User removed from shift",
                            success: true,
                        });
                    } else {
                        return res.status(404).json({
                            message: "User not found",
                            success: true,
                        });
                    }

                })
            } else {
                return res.status(404).json({
                    message: "User not found",
                    success: true,
                });
            }
        })
}
exports.removeUser = removeUser;
