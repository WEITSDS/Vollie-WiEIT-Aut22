import { Request, Response } from "express";
import User from "../User/user.model";
import Shift from "./Shift.model";
import mongoose from "mongoose";
import { Logger } from "tslog";
import { handleError } from "../utility";
import { isIBasicShift, mapShiftToShiftSummary } from "./shift.interface";

const logger = new Logger({ name: "shift.controller" });

/**
 * Create shift request
 * If a shift is created, return data object of details and response of 200
 * Else return a 500 error with the error message or indicate insufficient privileges 401
 */

export const createShift = (req: Request, res: Response) => {
    const isAdmin = req.session.user?.isAdmin || false;
    if (req.params.id && !isAdmin) {
        res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
        return;
    }
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
                    status: false,
                });
            }

            const newShift = new Shift({
                name: shiftFields.name,
                status: shiftFields.status,
                startAt: shiftFields.startAt,
                endAt: shiftFields.endAt,
                hours: shiftFields.hours,
                address: shiftFields.address,
                description: shiftFields.description,
            });

            newShift.id = new mongoose.Types.ObjectId();
            logger.info(newShift);
            newShift
                .save()
                .then((results) => {
                    return res.status(200).json({
                        message: "Shift created",
                        data: mapShiftToShiftSummary(results),
                        success: true,
                    });
                })
                .catch((err: unknown) => {
                    handleError(logger, res, err, "Shift creation failed");
                });
        })
        .catch((err: unknown) => {
            handleError(logger, res, err, "Shift creation failed");
        });
};

export const deleteShift = (req: Request, res: Response) => {
    const isAdmin = req.session.user?.isAdmin || false;
    if (!req.params.shiftid && isAdmin) {
        res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
        return;
    }
    Shift.deleteOne({ _id: req.params.shiftid })
        .exec()
        .then((deletionResult) => {
            console.log(deletionResult);
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
        .catch((err) => {
            handleError(logger, res, err, "Shift deletion failed");
        });
};

export const assignUser = async (req: Request, res: Response): Promise<void> => {
    const isAdmin = req.session.user?.isAdmin || false;
    const sessionUserId = req.session.user?._id;
    if (!isAdmin && sessionUserId !== req.params.userid) {
        res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
        return;
    }

    await Shift.findOneAndUpdate({ _id: req.params.shiftid }, { $addToSet: { users: req.params.userid } })
        .exec()
        .then(async (assignUserResponse): Promise<void> => {
            if (!assignUserResponse) {
                res.status(404).json({ message: "Shift not found", success: false });
                return;
            }
            await User.findOneAndUpdate({ _id: req.params.userid }, { $addToSet: { shifts: req.params.shiftid } })
                .exec()
                .then((assignShiftResponse) => {
                    if (assignShiftResponse) {
                        res.status(200).json({ message: "User assigned to shift", success: true });
                        return;
                    } else {
                        res.status(404).json({ message: "User not found", success: true });
                        return;
                    }
                })
                .catch((err) => {
                    handleError(logger, res, err, "Shift assignment to user failed");
                });
        })
        .catch((err) => {
            handleError(logger, res, err, "User assignment to shift failed");
        });
};

export const removeUser = async (req: Request, res: Response): Promise<void> => {
    const isAdmin = req.session.user?.isAdmin || false;
    const sessionUserId = req.session.user?._id;
    if (!isAdmin && sessionUserId !== req.params.userid) {
        res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
        return;
    }

    await Shift.findOneAndUpdate({ _id: req.params.shiftid }, { $pull: { users: req.params.userid } })
        .exec()
        .then(async (assignUserResponse): Promise<void> => {
            if (assignUserResponse) {
                await User.findOneAndUpdate({ _id: req.params.userid }, { $pull: { shifts: req.params.shiftid } })
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
                    });
            } /*
            return res.status(404).json({
                message: "Shift not found",
                success: true,
            });*/
        });
};

export const getAllShifts = async (req: Request, res: Response): Promise<any> => {
    try {
        const availableShifts = await Shift.find({ status: "Scheduled" });
        return res.status(200).json({
            message: "success",
            data: availableShifts,
            success: true,
        });
    } catch (error) {
        console.log("get all shifts error", error);
        return res.status(500).json({
            message: "get all shifts error",
            error,
            success: false,
        });
    }
};

export const getAvailableShifts = async (req: Request, res: Response): Promise<any> => {
    try {
        const { _id: userID } = req.session.user || {};

        // users can get their own shifts, if request is looking for user other than themselve, they must be admin
        if (!userID) return res.status(403).json({ message: "Authorization error", success: false });

        const userObj = await User.findOne({ _id: userID });
        // const userRole = userObj?.role || "testRole"
        const userRole = "testRole";

        const availableShifts = await Shift.find({
            $and: [{ "roles.${userRole}": { $gt: 0 } }, { status: "scheduled" }],
        });

        return res.status(200).json({
            message: "success",
            data: availableShifts,
            success: true,
        });
    } catch (error) {
        console.log("get available shifts error", error);
        return res.status(500).json({
            message: "get available shifts error",
            error,
            success: false,
        });
    }
};

export const getUserShifts = async (req: Request, res: Response): Promise<any> => {
    try {
        const { targetUserID, statusType } = req.params;

        // users can get their own shifts, if request is looking for user other than themselve, they must be admin
        if (targetUserID !== req.session.user?._id && !req.session.user?.isAdmin)
            return res.status(403).json({ message: "Authorization error", success: false });

        // Default to show all shifts (including finished ones)
        const availableShifts = await Shift.find({ users: { $all: [targetUserID] }, status: statusType || null });

        return res.status(200).json({
            message: "success",
            data: availableShifts,
            success: true,
        });
    } catch (error) {
        console.log("get user shifts error", error);
        return res.status(500).json({
            message: "get user shifts error",
            error,
            success: false,
        });
    }
};
