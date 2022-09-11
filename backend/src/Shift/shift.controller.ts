import { Request, Response } from "express";
import User from "../User/user.model";
import Shift from "./Shift.model";
import mongoose from "mongoose";
import { Logger } from "tslog";
import { handleError } from "../utility";
import { isIBasicShift, mapShiftToShiftSummary } from "./shift.interface";

const logger = new Logger({ name: "shift.controller" });

const getAttributeFromVolunteerType = (userRole: string | undefined): string => {
    let targetShiftAttribute = "numGeneralVolunteers";
    switch (userRole) {
        case "generalVolunteer":
            targetShiftAttribute = "numGeneralVolunteers";
            break;
        case "undergradAmbassador":
            targetShiftAttribute = "numUndergradAmbassadors";
            break;
        case "postgradAmbassador":
            targetShiftAttribute = "numPostgradAmbassadors";
            break;
        case "staffAmbassador":
            targetShiftAttribute = "numStaffAmbassadors";
            break;
        case "sprout":
            targetShiftAttribute = "numSprouts";
            break;
        default:
            break;
    }
    return targetShiftAttribute;
};

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
                numGeneralVolunteers: shiftFields.numGeneralVolunteers,
                numUndergradAmbassadors: shiftFields.numUndergradAmbassadors,
                numPostgradAmbassadors: shiftFields.numPostgradAmbassadors,
                numSprouts: shiftFields.numSprouts,
                numStaffAmbassadors: shiftFields.numStaffAmbassadors,
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

export const assignUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const isAdmin = req.session.user?.isAdmin || false;
        const sessionUserId = req.session.user?._id;
        if (!isAdmin && sessionUserId !== req.params.userid) {
            return res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
        }

        const targetShift: any = await Shift.findOne({ _id: req.params.shiftid });
        if (targetShift?.users.includes(req.params.userid)) {
            return res.status(401).json({ message: "Cannot double assign shift", success: false });
        }

        const userObj = await User.findOne({ _id: req.params.userid });
        const targetShiftAttribute = getAttributeFromVolunteerType(userObj?.volunteerType);

        if (targetShift[`${targetShiftAttribute}`] <= 0) {
            return res.status(401).json({ message: "No volunteer type slots available", success: false });
        }

        // for decrementing the relevant volunteer type of the shift
        const decAction: any = {
            $inc: {},
        };
        decAction.$inc[`${targetShiftAttribute}`] = -1;

        const assignUserResponse = await Shift.findOneAndUpdate(
            { _id: req.params.shiftid },
            { $addToSet: { users: req.params.userid }, ...decAction }
        );
        if (!assignUserResponse) {
            return res.status(404).json({ message: "Shift not found", success: false });
        }

        const assignShiftResponse = await User.findOneAndUpdate(
            { _id: req.params.userid },
            { $addToSet: { shifts: req.params.shiftid } }
        );
        if (assignShiftResponse) {
            return res.status(200).json({ message: "User assigned to shift", success: true });
        } else {
            return res.status(404).json({ message: "User not found", success: true });
        }
    } catch (err) {
        handleError(logger, res, err, "User assignment to shift failed");
    }
};

export const removeUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const isAdmin = req.session.user?.isAdmin || false;
        const sessionUserId = req.session.user?._id;
        if (!isAdmin && sessionUserId !== req.params.userid) {
            res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
            return;
        }

        const targetShift = await Shift.findOne({ _id: req.params.shiftid });

        if (!targetShift) {
            return res.status(404).json({
                message: "Shift not found",
                success: true,
            });
        }

        if (!targetShift?.users.includes(req.params.userid)) {
            return res.status(401).json({ message: "User doesn't exist in this shift", success: false });
        }

        const userObj = await User.findOne({ _id: req.params.userid });
        const targetShiftAttribute = getAttributeFromVolunteerType(userObj?.volunteerType);
        // for incrementing the relevant volunteer type of the shift as user is not taking up that spot
        const incAction: any = {
            $inc: {},
        };
        incAction.$inc[`${targetShiftAttribute}`] = 1;

        await Shift.findOneAndUpdate(
            { _id: req.params.shiftid },
            { $pull: { users: req.params.userid }, ...incAction }
        );

        const assignShiftResponse = await User.findOneAndUpdate(
            { _id: req.params.userid },
            { $pull: { shifts: req.params.shiftid } }
        );
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
    } catch (error) {
        return res.status(500).json({
            message: "error removing unassigning user",
            error,
            success: false,
        });
    }
};

export const getAllShifts = async (_req: Request, res: Response): Promise<any> => {
    try {
        const availableShifts = await Shift.find({ status: "Scheduled" }).sort({
            createdAt: -1,
        });
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

export const getShiftById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { _id: userID } = req.session.user || {};
        if (!userID) return res.status(403).json({ message: "Authorization error", success: false });

        const shift = await Shift.findOne({ _id: req.params.shiftId });
        return res.status(200).json({
            message: "got shift",
            success: true,
            data: shift,
        });
    } catch (error) {
        console.log("error getting shfit by id", error);
        return res.status(500).json({
            message: "error getting shfit by id",
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
        if (!userObj) return res.status(403).json({ message: "Could not find user object", success: false });
        const userRole = userObj?.volunteerType;
        const targetShiftAttribute = getAttributeFromVolunteerType(userRole);
        const numVolunteerQuery: any = { status: "Scheduled" };
        numVolunteerQuery[`${targetShiftAttribute}`] = { $gt: 0 };

        const availableShifts = await Shift.find({ ...numVolunteerQuery }).sort({ createdAt: -1 });

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
        const availableShifts = await Shift.find({ users: { $all: [targetUserID] }, status: statusType || null }).sort({
            createdAt: -1,
        });

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
