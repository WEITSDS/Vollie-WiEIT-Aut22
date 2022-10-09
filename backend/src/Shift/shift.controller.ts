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
// import { IQualificationType } from "../QualificationType/qualificationType.interface";
// import { ObjectId } from "mongodb";

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

    const shiftId: string = req.params.shiftid;

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
        if (qualObj?.approved && qualType && qualType._id) approvedQualIDs.push(qualType?._id.toString());
    }
    return approvedQualIDs;
};

const getUserApprovedVolunteerTypes = (user: IUser): Array<string> => {
    return user.volunteerTypes.filter((volType) => !!volType.approved).map((volType) => volType.type.toString());
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
        if (!isAdmin && sessionUserId.toString() !== req.params.userid) {
            res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
            return;
        }

        const targetShift = await Shift.findOne({ _id: req.params.shiftid });
        if (!targetShift) {
            res.status(404).json({ message: "Shift not found", success: false });
            return;
        }

        if (targetShift?.users?.some((userShift) => userShift.user.toString() === req.params.userid)) {
            res.status(401).json({ message: "Cannot double assign shift", success: false });
            return;
        }

        const targetUser = await User.findById(req.params.userid);
        if (!targetUser) {
            res.status(404).json({ message: "Target user not found", success: false });
            return;
        }

        // Check if user has the required qualifications for the shift
        // Loop through the qualifications required by the shift, if any are not approved on the user, set to false and return
        const userApprovedQualificationType = await getUserApprovedQualificationTypes(targetUser);
        let userHasAllQualifications = true;
        // Checks if this particular qualification type has enough people in the shift (if enough ppl meet the qualification num required, then this particular user doesn't need to have it)
        // As an example, if a shift requires a minimum of 2 people with first aid training, then people without first aid training can take this shift only after the requirement has been filled
        for (const shiftQual of targetShift.requiredQualifications) {
            if (
                shiftQual.currentNum < shiftQual.numRequired &&
                !userApprovedQualificationType.includes(shiftQual.qualificationType.toString()) // Checks if the target use has this particular qualification type in an approved status
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
            (volType) => volType.type.toString() === selectedVolunteerTypeID && volType.approved === true
        );
        if (userVolTypeIndex === -1) {
            res.status(401).json({
                message:
                    "Target user's selected volunteer type is either not approved or does not exist for this user.",
                success: false,
            });
            return;
        }

        // check if slots are available for this vol type
        const volTypeShiftObj = targetShift.volunteerTypeAllocations.find(
            (volType) => volType?.type.toString() === selectedVolunteerTypeID
        );
        if (volTypeShiftObj === undefined || volTypeShiftObj.currentNum >= volTypeShiftObj.numMembers) {
            // in this condition, there are no slots available for this volunteer type in this shift
            res.status(401).json({
                message: "Target volunteer type has no available slots for this user.",
                success: false,
            });
            return;
        }

        // At this point, we can finally assign the user and update the shift info
        // This will also increment the currentNum for that vol type
        const assignUserResponse = await Shift.findOneAndUpdate(
            { _id: req.params.shiftid, "volunteerTypeAllocations.type": selectedVolunteerTypeID },
            {
                $addToSet: {
                    users: { user: req.params.userid, chosenVolunteerType: selectedVolunteerTypeID, approved: false },
                },
                $inc: { "volunteerTypeAllocations.$.currentNum": 1 },
            }
        );
        if (!assignUserResponse) {
            res.status(404).json({ message: "Error updating shift", success: false });
            return;
        }

        const assignShiftResponse = await User.findOneAndUpdate(
            { _id: req.params.userid },
            { $addToSet: { shifts: { shift: req.params.shiftid, approved: false } } }
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

export const approveUser = async (req: Request, res: Response) => {
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
        const userObj = await User.findOne({ _id: req.params.userid });
        const userShiftAllocationIdx = targetShift?.users.findIndex(
            (shiftUser) => shiftUser.user.toString() === userObj?._id.toString()
        );
        if (userShiftAllocationIdx === -1) {
            res.status(401).json({ message: "User doesn't exist in this shift", success: false });
            return;
        }

        await Shift.findOneAndUpdate(
            { _id: req.params.shiftid, "users.user": req.params.userid },
            { $set: { "users.$.approved": true } }
        );

        const approveUserResponse = await User.findOneAndUpdate(
            { _id: req.params.userid, "shifts.shift": req.params.shiftid },
            { $set: { "shifts.$.approved": true } }
        );
        if (approveUserResponse) {
            res.status(200).json({
                message: "Users shift approved",
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
            message: "error approving user",
            error,
            success: false,
        });
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
        const userObj = await User.findOne({ _id: req.params.userid });
        const userShiftAllocationIdx = targetShift?.users.findIndex(
            (shiftUser) => shiftUser.user.toString() === userObj?._id.toString()
        );
        if (userShiftAllocationIdx === -1) {
            res.status(401).json({ message: "User doesn't exist in this shift", success: false });
            return;
        }

        const selectedVolunteerTypeID = targetShift?.users[userShiftAllocationIdx].chosenVolunteerType.toString();

        if (!selectedVolunteerTypeID || selectedVolunteerTypeID == "") {
            res.status(401).json({ message: "Error getting chosen volunteer type for user in shift.", success: false });
            return;
        }

        await Shift.findOneAndUpdate(
            { _id: req.params.shiftid, "volunteerTypeAllocations.type": selectedVolunteerTypeID },
            { $pull: { users: { user: req.params.userid } }, $inc: { "volunteerTypeAllocations.$.currentNum": -1 } }
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

        const shift = await Shift.findOne({ _id: req.params.shiftid });
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
        if (!userID) {
            res.status(403).json({ message: "Authorization error", success: false });
            return;
        }

        const userObj = await User.findOne({ _id: userID });
        if (!userObj) {
            res.status(403).json({ message: "Could not find user object", success: false });
            return;
        }

        const approvedUserVolTypes = getUserApprovedVolunteerTypes(userObj);

        // Only show events that are UPCOMING and sort by upcoming start at dates
        let availableShifts = await Shift.find({
            startAt: { $gte: Date.now() },
            "volunteerTypeAllocations.type": { $in: approvedUserVolTypes },
        }).sort({
            startAt: 1,
        });

        // filter to ensure that only return shifts where approved user vol types have available slots
        availableShifts = availableShifts.filter((shift) => {
            let hasSlotsAvailable = false;
            for (const volAllocation of shift.volunteerTypeAllocations) {
                if (
                    approvedUserVolTypes.includes(volAllocation.type.toString()) &&
                    volAllocation.currentNum < volAllocation.numMembers
                ) {
                    hasSlotsAvailable = true;
                    break;
                }
            }
            return hasSlotsAvailable;
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
        const targetUserID  = req.params.userid;

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
