import { NextFunction, Request, Response } from "express";
import User from "./user.model";
import Shift from "../Shift/Shift.model";
import mongoose from "mongoose";
import { Logger } from "tslog";
import * as sessionManager from "../Common/middleware/sessionManagement";
import { handleError } from "../utility";
import { isIBasicShift, mapShiftToShiftSummary } from "./shift.interface";

const logger = new Logger({ name: "shift.controller" });

/**
 * Create shift request
 * If a shift is created, return data object of details and response of 200
 * Else return a 500 error with the error message or indicate insufficient privileges 401
 */

export const createShift = (req: Request, res: Response) => {
    if (!(req.params.id) && req.session.user.isAdmin) {
        const shiftFields = req.body as unknown;
        if (!isIBasicShift(shiftFields)) {
            res.status(400).json({ message: "New shift request body was not valid", success: false });
            return;
        }

        Shift.findOne({ name: shiftFields.name })
            .exec()
            .then((existingShift) => {
                if (existingShift) {
                    logger.warn(existingShift);
                    res.json({
                        message: "Shift already exists",
                        status: false
                    })
                }
            
            const newShift = new Shift({
                name: shiftFields.name,
                status: shiftFields.status,
                startAt: shiftFields.startAt,
                endAt: shiftFields.endAt,
                hours: shiftFields.hours,
                address: shiftFields.address,
                addressDescription: shiftFields.addressDescription
            })
            
            newShift.id = new mongoose.Types.ObjectId();
            logger.ingo(newShift)

            newShift
                .save()
                .then((results) => {
                    return res.status(200).json({
                        message: "Shift created",
                        data: mapShiftToShiftSummary(results),
                        success: true,
                    })
                })
                .catch((err: unknown) => {
                    handleError(logger, res, err, "Shift creation failed");
                });
            })
            .catch((err: unknown) => {
                handleError(logger, res, err, "Shift creation failed");
            });
    } else {
        return res.status(401).json({
            message: "Unauthorised, admin privileges are required",
            success: false,
        });
    }
};

export const deleteShift = (req: Request, res: Response) => {
    if (!(req.params.id) && req.session.user.isAdmin) {
        Shift.deleteOne({ _id: req.params})
            .exec()
            .then(deletionResult => {
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
                handleError(logger, res, err, "Shift deletion failed");
            })
    }
};

export const assignUser = (req: Request, res: Response) => {
    Shift.findOneAndUpdate( { _id: req.params.shiftid }, { $push: { users: req.session.user._id } } )
        .exec()
        .then((assignUserResponse) => {
            if (assignUserResponse) {
                User.findOneAndUpdate( { _id: req.session.user._id }, { $push: { shifts: req.params.shiftid } } )
                    .exec()
                    .then((assignShiftResponse) => {
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

export const removeUser = (req: Request, res: Response) => {
    Shift.findOneAndUpdate( { _id: req.params.shiftid }, { $pull: { users: req.session.user._id } } )
        .exec()
        .then((assignUserResponse) => {
            if (assignUserResponse) {
                User.findOneAndUpdate( { _id: req.session.user._id }, { $pull: { shifts: req.params.shiftid } } )
                    .exec()
                    .then((assignShiftResponse) => {
                        if (assignShiftResponse) {
                            return res.status(200).json({
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
                    message: "Shift not found",
                    success: true,
                });
            }
        })
}
