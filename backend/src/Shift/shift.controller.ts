import { Request, Response } from "express";
import User from "../User/user.model";
import Shift from "./Shift.model";
// import mongoose from "mongoose";
import { Logger } from "tslog";
import { handleError } from "../utility";
import { IShift } from "./shift.interface";
import { IUser, mapUserToAttendanceSummary } from "../User/user.interface";
import QualificationType from "../QualificationType/qualificationType.model";
import Qualifications from "../Qualifications/qualification.model";
import { IQualificationType } from "../QualificationType/qualificationType.interface";

const logger = new Logger({ name: "shift.controller" });

// const getAttributeFromVolunteerType = (userRole: string | undefined): keyof IShift => {
//     let targetShiftAttribute: keyof IShift = "numGeneralVolunteers";
//     switch (userRole) {
//         case "generalVolunteer":
//             targetShiftAttribute = "numGeneralVolunteers";
//             break;
//         case "undergradAmbassador":
//             targetShiftAttribute = "numUndergradAmbassadors";
//             break;
//         case "postgradAmbassador":
//             targetShiftAttribute = "numPostgradAmbassadors";
//             break;
//         case "staffAmbassador":
//             targetShiftAttribute = "numStaffAmbassadors";
//             break;
//         case "sprout":
//             targetShiftAttribute = "numSprouts";
//             break;
//         default:
//             break;
//     }
//     return targetShiftAttribute;
// };

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

export const updateShift = async (req: Request, res: Response) => {
    // Get user obj to check if admin
    const userObj = await User.findOne({ _id: req.session.user?._id });

    if (!userObj || !userObj?.isAdmin) {
        handleError(logger, res, null, "Unauthorized", 401);
        return;
    }

    const shiftId: string = req.params.shiftId;

    if (!shiftId) {
        handleError(logger, res, null, "No shift ID provided for update", 401);
        return;
    }

    const shiftFields = req.body as IShift;

    try {
        const updatedShift = await Shift.findOneAndUpdate({ _id: shiftId }, shiftFields);

        res.status(200).json({
            message: "Shift updated",
            data: updatedShift,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "Shift update failed");
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

// Get an array of approved qualification types for a specific user
const getUserApprovedQualificationTypes = async (user: IUser): Promise<Array<string>> => {
    const approvedQualIDs = [] as Array<string>;
    for (const userQual of user.qualifications) {
        const qualObj = await Qualifications.findById(userQual);
        const qualType = await QualificationType.findById(qualObj?.qualificationType);
        if (qualObj?.approved && qualType) approvedQualIDs.push(qualType._id as string);
    }
    return approvedQualIDs;
};

export const assignUser = async (req: Request, res: Response) => {
    try {
        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj) {
            res.status(404).json({ message: "Requesting user doesn't exist", success: false });
            return;
        }

        const isAdmin = userObj?.isAdmin || false;
        const sessionUserId = userObj._id;
        console.log("is assigning self?", sessionUserId.toString(), req.params.userid);
        if (!isAdmin && sessionUserId.toString() !== req.params.userid) {
            res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
            return;
        }

        const targetShift = await Shift.findOne({ _id: req.params.shiftid });
        if (!targetShift) {
            res.status(404).json({ message: "Shift not found", success: false });
            return;
        }

        if (targetShift?.users?.some((userShift) => userShift.user === req.params.userid)) {
            res.status(401).json({ message: "Cannot double assign shift", success: false });
            return;
        }

        const targetUser = await User.findById(req.params.userid);
        if (!targetUser) {
            res.status(404).json({ message: "Target user not found", success: false });
            return;
        }

        // const targetShiftAttribute = getAttributeFromVolunteerType(userObj?.volunteerType);

        // if (targetShift && targetShift[`${targetShiftAttribute}`] <= 0) {
        //     res.status(401).json({ message: "No volunteer type slots available", success: false });
        //     return;
        // }

        // Check if user has the required qualifications for the shift
        // Loop through the qualifications required by the shift, if any are not approved on the user, set to false and return
        const userApprovedQualificationType = await getUserApprovedQualificationTypes(targetUser);
        let userHasAllQualifications = true;
        // Checks if this particular qualification type has enough people in the shift (if enough ppl meet the qualification num required, then this particular user doesn't need to have it)
        // As an example, if a shift requires a minimum of 2 people with first aid training, then people without first aid training can take this shift only after the requirement has been filled
        for (const shiftQual of targetShift.requiredQualifications) {
            if (
                shiftQual.currentNum < shiftQual.numRequired &&
                !userApprovedQualificationType.includes(shiftQual.qualificationType as string) // Checks if the target use has this particular qualification type in an approved status
            ) {
                userHasAllQualifications = false;
            }
        }
        if (!userHasAllQualifications) {
            res.status(401).json({
                message: "Target user does not meet the required qualifications for this shift.",
                success: false,
            });
            return;
        }

        // Check if user's selected volunteer type is approved
        const selectedVolunteerTypeID = req.params.selectedVolunteerTypeID;
        // -1 if either voltype doesnt exist for the user OR the type is not approved yet
        const userVolTypeIndex = targetUser.volunteerTypes.findIndex(
            (volType) => volType.type === selectedVolunteerTypeID && volType.approved === true
        );
        if (userVolTypeIndex === -1) {
            res.status(401).json({
                message:
                    "Target user's selected volunteer type is either not approved or does not exist for this user.",
                success: false,
            });
            return;
        }

        // still more to do, check if voltype slot available then finally do incrementing/decrementing necessary

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

        // Only show events that are UPCOMING and sort by upcoming start at dates
        const availableShifts = await Shift.find({ ...numVolunteerQuery, startAt: { $gte: Date.now() } }).sort({
            startAt: 1,
        });

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
        if (targetUserID !== userObj._id.toString() && !userObj.isAdmin) {
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
