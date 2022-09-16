import { Request, Response } from "express";
import User from "../User/user.model";
import Shift from "./Shift.model";
// import mongoose from "mongoose";
import { Logger } from "tslog";
import { handleError } from "../utility";
import { IShift } from "./shift.interface";
import { mapUserToAttendanceSummary } from "../User/user.interface";

const logger = new Logger({ name: "shift.controller" });

const getAttributeFromVolunteerType = (userRole: string | undefined): keyof IShift => {
    let targetShiftAttribute: keyof IShift = "numGeneralVolunteers";
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

export const createShift = async (req: Request, res: Response) => {
    // Get user obj to check if admin
    const userObj = await User.findOne({ _id: req.session.user?._id });

    if (!userObj || !userObj?.isAdmin) {
        handleError(logger, res, null, "Unauthorized", 401);
        return;
    }

    const shiftFields = req.body as IShift;

    // TODO: Field value validation here!

    try {
        const newShift = new Shift({
            ...shiftFields,
        });

        const savedShift = await newShift.save();

        res.status(200).json({
            message: "Shift created",
            data: savedShift,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "Shift creation failed");
        return;
    }
};

export const deleteShift = async (req: Request, res: Response) => {
    try {
        // Get user obj to check if admin
        const userObj = await User.findOne({ _id: req.session.user?._id });

        if (!userObj || !userObj?.isAdmin) {
            handleError(logger, res, null, "Unauthorized", 401);
            return;
        }

        const deletionResult = await Shift.deleteOne({ _id: req.params.shiftid });

        if (deletionResult.acknowledged && deletionResult.deletedCount > 0) {
            res.status(200).json({
                message: "Shift deleted",
                success: true,
            });
            return;
        } else {
            res.status(404).json({
                message: "Shift id not found",
                success: false,
            });
            return;
        }
    } catch (error) {
        handleError(logger, res, error, "Shift deletion failed");
        return;
    }
};

export const assignUser = async (req: Request, res: Response) => {
    try {
        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj) {
            res.status(404).json({ message: "User not found", success: false });
            return;
        }

        const isAdmin = userObj?.isAdmin || false;
        const sessionUserId = userObj._id;
        if (!isAdmin && sessionUserId !== req.params.userid) {
            res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
            return;
        }

        const targetShift = await Shift.findOne({ _id: req.params.shiftid });
        if (targetShift?.users?.includes(req.params.userid)) {
            res.status(401).json({ message: "Cannot double assign shift", success: false });
            return;
        }

        const targetShiftAttribute = getAttributeFromVolunteerType(userObj?.volunteerType);

        if (targetShift && targetShift[`${targetShiftAttribute}`] <= 0) {
            res.status(401).json({ message: "No volunteer type slots available", success: false });
            return;
        }

        // for decrementing the relevant volunteer type of the shift
        const decAction = {
            $inc: {
                [targetShiftAttribute]: -1,
            },
        };

        const assignUserResponse = await Shift.findOneAndUpdate(
            { _id: req.params.shiftid },
            { $addToSet: { users: req.params.userid }, ...decAction }
        );
        if (!assignUserResponse) {
            res.status(404).json({ message: "Shift not found", success: false });
            return;
        }

        const assignShiftResponse = await User.findOneAndUpdate(
            { _id: req.params.userid },
            { $addToSet: { shifts: req.params.shiftid } }
        );
        if (assignShiftResponse) {
            res.status(200).json({ message: "User assigned to shift", success: true });
            return;
        } else {
            res.status(404).json({ message: "User not found", success: true });
            return;
        }
    } catch (err) {
        handleError(logger, res, err, "User assignment to shift failed");
        return;
    }
};

export const removeUser = async (req: Request, res: Response) => {
    try {
        const isAdmin = req.session.user?.isAdmin || false;
        const sessionUserId = req.session.user?._id;
        if (!isAdmin && sessionUserId !== req.params.userid) {
            res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
            return;
        }

        const targetShift = await Shift.findOne({ _id: req.params.shiftid });

        if (!targetShift) {
            res.status(404).json({
                message: "Shift not found",
                success: true,
            });
            return;
        }

        if (!targetShift?.users.includes(req.params.userid)) {
            res.status(401).json({ message: "User doesn't exist in this shift", success: false });
            return;
        }

        const userObj = await User.findOne({ _id: req.params.userid });
        const targetShiftAttribute = getAttributeFromVolunteerType(userObj?.volunteerType);

        // for incrementing the relevant volunteer type of the shift as user is not taking up that spot
        const incAction = {
            $inc: {
                [targetShiftAttribute]: 1,
            },
        };

        await Shift.findOneAndUpdate(
            { _id: req.params.shiftid },
            { $pull: { users: req.params.userid }, ...incAction }
        );

        const assignShiftResponse = await User.findOneAndUpdate(
            { _id: req.params.userid },
            { $pull: { shifts: req.params.shiftid } }
        );
        if (assignShiftResponse) {
            res.status(200).json({
                message: "User removed from shift",
                success: true,
            });
            return;
        } else {
            res.status(404).json({
                message: "User not found",
                success: true,
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            message: "error removing unassigning user",
            error,
            success: false,
        });
        return;
    }
};

export const getAllShifts = async (_req: Request, res: Response) => {
    try {
        const availableShifts = await Shift.find().sort({
            startAt: 1,
        });
        res.status(200).json({
            message: "success",
            data: availableShifts,
            success: true,
        });
        return;
    } catch (error) {
        console.log("get all shifts error", error);
        res.status(500).json({
            message: "get all shifts error",
            error,
            success: false,
        });
        return;
    }
};

export const getShiftById = async (req: Request, res: Response) => {
    try {
        const { _id: userID } = req.session.user || {};
        if (!userID) {
            res.status(403).json({ message: "Authorization error", success: false });
            return;
        }

        const userObj = await User.findOne({ _id: userID });
        if (!userObj) {
            res.status(403).json({ message: "Could not find user object", success: false });
            return;
        }

        const shift = await Shift.findOne({ _id: req.params.shiftId });
        if (!shift) {
            res.status(404).json({ message: "Shift not found", success: false });
            return;
        }

        res.status(200).json({
            message: "got shift",
            success: true,
            data: shift,
        });
        return;
    } catch (error) {
        console.log("error getting shfit by id", error);
        res.status(500).json({
            message: "error getting shfit by id",
            error,
            success: false,
        });
        return;
    }
};

export const getAvailableShifts = async (req: Request, res: Response) => {
    try {
        const { _id: userID } = req.session.user || {};

        // users can get their own shifts, if request is looking for user other than themselve, they must be admin
        if (!userID) {
            res.status(403).json({ message: "Authorization error", success: false });
            return;
        }

        const userObj = await User.findOne({ _id: userID });
        if (!userObj) {
            res.status(403).json({ message: "Could not find user object", success: false });
            return;
        }
        const userRole = userObj?.volunteerType;
        const targetShiftAttribute = getAttributeFromVolunteerType(userRole);
        const numVolunteerQuery = { [targetShiftAttribute]: { $gt: 0 } };
        // numVolunteerQuery[`${targetShiftAttribute}`] = { $gt: 0 };

        // console.log(numVolunteerQuery);

        const availableShifts = await Shift.find({ ...numVolunteerQuery }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "success",
            data: availableShifts,
            success: true,
        });
        return;
    } catch (error) {
        console.log("get available shifts error", error);
        res.status(500).json({
            message: "get available shifts error",
            error,
            success: false,
        });
        return;
    }
};

export const getUserShifts = async (req: Request, res: Response) => {
    try {
        const { targetUserID } = req.params;

        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj) {
            res.status(403).json({ message: "Could not find user object", success: false });
            return;
        }

        // users can get their own shifts, if request is looking for user other than themselve, they must be admin
        if (targetUserID !== userObj._id && !userObj.isAdmin) {
            res.status(403).json({ message: "Authorization error", success: false });
            return;
        }

        // Default to show all shifts (including finished ones)
        const availableShifts = await Shift.find({ users: { $all: [targetUserID] } }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            message: "success",
            data: availableShifts,
            success: true,
        });
        return;
    } catch (error) {
        console.log("get user shifts error", error);
        res.status(500).json({
            message: "get user shifts error",
            error,
            success: false,
        });
        return;
    }
};

export const getShiftAttendanceList = async (req: Request, res: Response) => {
    try {
        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj) {
            res.status(403).json({ message: "Could not find user object", success: false });
            return;
        }

        // only admin can view participants
        if (!userObj.isAdmin) {
            res.status(403).json({ message: "Authorization error", success: false });
            return;
        }

        const { shiftId } = req.params;
        if (!shiftId) {
            res.status(403).json({ message: "No shift ID provided", success: false });
            return;
        }

        const shift = await Shift.findOne({ _id: shiftId });

        const participants = await User.find({ _id: { $in: shift?.users || [] } });

        res.status(200).json({
            message: "success",
            data: participants.map(mapUserToAttendanceSummary),
            success: true,
        });
        return;
    } catch (error) {
        console.log("get shift attendance list error", error);
        res.status(500).json({
            message: "get shift attendance list error",
            error,
            success: false,
        });
        return;
    }
};
