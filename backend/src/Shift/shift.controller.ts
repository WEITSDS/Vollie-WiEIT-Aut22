import { Request, Response } from "express";
import User from "../User/user.model";
import Shift from "./shift.model";
import mongoose from "mongoose";
import { Logger } from "tslog";
import ical from "ical-generator";
import { handleError } from "../utility";
import {
    IShift,
    IShiftRequiredQualification,
    IShiftVolunteerAllocations,
    IShiftFiltersRequest,
    IExportShiftRequest,
} from "./shift.interface";
import { IUser, UserShiftAttendaceSummary } from "../User/user.interface";
import QualificationType from "../QualificationType/qualificationType.model";
import Qualifications from "../Qualifications/qualification.model";
// import { IQualificationType } from "../QualificationType/qualificationType.interface";
// import { ObjectId } from "mongodb";
import VolunteerType from "../VolunteerType/volunteerType.model";
import { sendSignedUpShiftEmail, sendCancelledShiftEmail, sendUpdateShiftEmail } from "../mailer/mailer";
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

    req.body._id = new mongoose.Types.ObjectId();

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
        const shiftObj = await Shift.findOne({ _id: shiftId });

        if (!shiftObj) {
            res.status(403).json({ message: "Could not find shift object", success: false });
            return;
        }

        for (let idx = 0; idx < shiftObj.users.length; idx++) {
            const participant = shiftObj.users[idx];
            const targetUser = await User.findOne({ _id: participant.user });
            sendUpdateShiftEmail(
                targetUser?.firstName || "",
                targetUser?.email || "",
                shiftObj.name,
                shiftObj.address,
                shiftObj.startAt,
                shiftObj.endAt
            );
        }

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
        let userHasAllQualifications = false;
        // Checks if this particular qualification type has enough people in the shift (if enough ppl meet the qualification num required, then this particular user doesn't need to have it)
        // As an example, if a shift requires a minimum of 2 people with first aid training, then people without first aid training can take this shift only after the requirement has been filled
        for (const shiftQual of targetShift.requiredQualifications) {
            if (
                userApprovedQualificationType.includes(shiftQual.qualificationType.toString()) // Checks if the target use has this particular qualification type in an approved status
            ) {
                userHasAllQualifications = true;
            }
        }
        //Current Number > Total Number - Total Qualifications and Qualification is not valid
        const totalNumber = (volTypeAllocations: Array<IShiftVolunteerAllocations>) => {
            let totalNumber = 0;
            for (const volunteer of volTypeAllocations) {
                totalNumber += volunteer.numMembers;
            }
            return totalNumber;
        };
        const totalNumberQual = (requiredQualifications: Array<IShiftRequiredQualification>) => {
            let totalNumber = 0;
            for (const qualification of requiredQualifications) {
                totalNumber += qualification.numRequired;
            }
            return totalNumber;
        };
        if (
            targetShift.users.length >=
                totalNumber(targetShift.volunteerTypeAllocations) -
                    totalNumberQual(targetShift.requiredQualifications) &&
            !userHasAllQualifications
        ) {
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
        // also increment the qualification allocations based on user quals
        const assignUserResponse = await Shift.findOneAndUpdate(
            {
                _id: req.params.shiftid,
            },
            {
                $addToSet: {
                    users: { user: req.params.userid, chosenVolunteerType: selectedVolunteerTypeID, approved: false },
                },
            }
        );

        const incrementVolTypeResponse = await Shift.findOneAndUpdate(
            {
                _id: req.params.shiftid,
                "volunteerTypeAllocations.type": selectedVolunteerTypeID,
            },
            {
                $inc: { "volunteerTypeAllocations.$.currentNum": 1 },
            }
        );

        if (!incrementVolTypeResponse) {
            res.status(401).json({ message: "Error updating shift", success: false });
            return;
        }

        // Qual type increment needs to be done manually cause $ operator only gives 1st match
        const newQualAllocs = incrementVolTypeResponse?.requiredQualifications;

        for (let index = 0; index < newQualAllocs.length; index++) {
            const qualAlloc = newQualAllocs[index];
            if (userApprovedQualificationType.includes(qualAlloc.qualificationType.toString())) {
                newQualAllocs[index].currentNum += 1;
            }
        }

        const incrementQualTypeResponse = await Shift.updateOne(
            {
                _id: req.params.shiftid,
            },
            {
                $set: { requiredQualifications: newQualAllocs },
            }
        );

        if (!assignUserResponse || !incrementVolTypeResponse || !incrementQualTypeResponse) {
            res.status(401).json({ message: "Error updating shift", success: false });
            return;
        }

        const assignShiftResponse = await User.findOneAndUpdate(
            { _id: req.params.userid },
            { $addToSet: { shifts: { shift: req.params.shiftid, approved: false } } }
        );

        if (assignShiftResponse) {
            res.status(200).json({ message: "User assigned to shift", success: true });
            //Send sign up email
            void sendSignedUpShiftEmail(
                targetUser.firstName,
                targetUser.email,
                targetShift.name,
                targetShift.address,
                targetShift.startAt,
                targetShift.endAt
            );
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

export const setUserApproval = async (req: Request, res: Response) => {
    try {
        const isAdmin = req.session.user?.isAdmin || false;
        const sessionUserId = req.session.user?._id;
        if (!isAdmin && sessionUserId !== req.params.userid) {
            res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
            return;
        }

        const targetShift = await Shift.findOne({ _id: req.params.shiftid });

        const approvalStatus = req.params.approvalstatus === "approve";

        if (!targetShift) {
            res.status(404).json({
                message: "Shift not found",
                success: true,
            });
            return;
        }
        const userObj = await User.findOne({ _id: req.params.userid });

        if (!userObj) {
            res.status(404).json({ message: "User doesn't exist with that ID", success: false });
            return;
        }

        const userShiftAllocationIdx = targetShift?.users.findIndex(
            (shiftUser) => shiftUser.user.toString() === userObj?._id.toString()
        );
        if (userShiftAllocationIdx === -1) {
            res.status(401).json({ message: "User doesn't exist in this shift", success: false });
            return;
        }

        await Shift.findOneAndUpdate(
            { _id: req.params.shiftid, "users.user": req.params.userid },
            { $set: { "users.$.approved": approvalStatus } }
        );

        const approveUserResponse = await User.findOneAndUpdate(
            { _id: req.params.userid, "shifts.shift": req.params.shiftid },
            { $set: { "shifts.$.approved": approvalStatus } }
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
        if (!userObj) {
            res.status(404).json({ message: "User doesn't exist with that ID", success: false });
            return;
        }
        const userShiftAllocationIdx = targetShift?.users.findIndex(
            (shiftUser) => shiftUser.user.toString() === userObj?._id.toString()
        );
        if (userShiftAllocationIdx === -1) {
            res.status(401).json({ message: "User doesn't exist in this shift", success: false });
            return;
        }

        const targetUser = await User.findById(req.params.userid);
        if (!targetUser) {
            res.status(404).json({ message: "Target user not found", success: false });
            return;
        }

        const selectedVolunteerTypeID = targetShift?.users[userShiftAllocationIdx].chosenVolunteerType;

        if (!selectedVolunteerTypeID) {
            res.status(401).json({ message: "Error getting chosen volunteer type for user in shift.", success: false });
            return;
        }

        const updatedShift = await Shift.findOneAndUpdate(
            {
                _id: req.params.shiftid,
                "volunteerTypeAllocations.type": selectedVolunteerTypeID,
            },
            {
                $pull: { users: { user: req.params.userid } },
                $inc: { "volunteerTypeAllocations.$.currentNum": -1 },
            }
        );

        if (!updatedShift) {
            res.status(401).json({
                message: "Error updating shift",
                success: false,
            });
            return;
        }

        // Qual type increment needs to be done manually cause $ operator only gives 1st match
        const userApprovedQualificationType = await getUserApprovedQualificationTypes(userObj);
        const newQualAllocs = updatedShift?.requiredQualifications;

        for (let index = 0; index < newQualAllocs.length; index++) {
            const qualAlloc = newQualAllocs[index];
            if (userApprovedQualificationType.includes(qualAlloc.qualificationType.toString())) {
                newQualAllocs[index].currentNum -= 1;
            }
        }

        const updateShiftQualAllocs = await Shift.updateOne(
            {
                _id: req.params.shiftid,
            },
            {
                $set: { requiredQualifications: newQualAllocs },
            }
        );

        const assignShiftResponse = await User.findOneAndUpdate(
            { _id: req.params.userid },
            { $pull: { shifts: { shift: req.params.shiftid } } }
        );

        if (assignShiftResponse && updateShiftQualAllocs) {
            res.status(200).json({ message: "User removed from shift", success: true });
            //Send shift cancelled email
            void sendCancelledShiftEmail(
                targetUser.firstName,
                targetUser.email,
                targetShift.name,
                targetShift.address,
                targetShift.startAt
            );
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

export const generateShiftCalendar = async (req: Request, res: Response) => {
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

        const shifts = await Shift.find({
            "users.user": userID,
        }).sort({
            startAt: 1,
        });

        const calendar = ical({ name: `${userObj.firstName} ${userObj.lastName} Shift Calendar` });

        for (let i = 0; i < shifts.length; i++) {
            const shift = shifts[i];
            const startTime = new Date(shift.startAt);
            const endTime = new Date(shift.endAt);
            calendar.createEvent({
                start: startTime,
                end: endTime,
                summary: shift.name,
                description: shift.description,
                location: shift.address,
                url: `http://localhost:3000/shift/${shift._id}`,
            });
        }

        calendar.serve(res);

        return;
    } catch (error) {
        console.log("error generating calendar", error);
        res.status(500).json({
            message: "error generating calendar",
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
            message: "Shift found",
            success: true,
            data: shift,
        });
        return;
    } catch (error) {
        console.log("error getting shift by id", error);
        res.status(500).json({
            message: "error getting shift by id",
            error,
            success: false,
        });
        return;
    }
};

const hoursConfigMapping = {
    Short: {
        $lte: 2,
    },
    Medium: {
        $gte: 3,
        $lte: 4,
    },
    Long: {
        $gte: 5,
    },
} as { [key: string]: Record<string, number> };

export const getFindConfigFromFilters = (filters: IShiftFiltersRequest) => {
    return {
        startAt: {
            $gte: Date.parse(filters.from),
        },
        endAt: {
            $lte: Date.parse(filters.to),
        },
        ...(filters.hours !== "All" &&
            hoursConfigMapping[filters.hours] && {
                hours: hoursConfigMapping[filters.hours],
            }),
        ...(filters.category !== "All" && { category: filters.category }),
        ...(filters.volTypes.length > 0 && {
            "volunteerTypeAllocations.type": { $in: filters.volTypes.map((volType) => volType.value) },
        }),
    };
};

export const getSearchShifts = async (req: Request, res: Response) => {
    try {
        const { _id: userID } = req.session.user || {};
        if (!userID) {
            res.status(403).json({ message: "Authorisation error", success: false });
            return;
        }

        const defaultFilters = {
            from: new Date().toDateString(),
            to: new Date(Date.now() + 31536000000).toDateString(), //Default to a year from now
            role: "All",
            category: "All",
            hours: "All",
            hideUnavailable: true,
            volTypes: [],
        } as IShiftFiltersRequest;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const filters = { ...defaultFilters, ...req?.body?.filters } as IShiftFiltersRequest;

        const userObj = await User.findOne({ _id: userID });
        if (!userObj) {
            res.status(403).json({ message: "Could not find user object", success: false });
            return;
        }

        // Only show events that are UPCOMING and sort by upcoming start at dates
        let availableShifts = await Shift.find({
            ...getFindConfigFromFilters(filters),
        }).sort({
            startAt: 1,
        });

        if (filters.hideUnavailable) {
            // filter to ensure that only return shifts where approved user vol types have available slots
            availableShifts = availableShifts.filter((shift) => {
                let hasSlotsAvailable = false;
                for (const volAllocation of shift.volunteerTypeAllocations) {
                    if (volAllocation.currentNum < volAllocation.numMembers) {
                        hasSlotsAvailable = true;
                        break;
                    }
                }
                return hasSlotsAvailable;
            });
        }

        res.status(200).json({
            message: "success",
            data: availableShifts,
            success: true,
        });
        return;
    } catch (error) {
        console.log("get search shifts error", error);
        res.status(500).json({
            message: "get search shifts error",
            error,
            success: false,
        });
        return;
    }
};

export const exportAdminShifts = async (req: Request, res: Response) => {
    try {
        const { _id: userID } = req.session.user || {};
        if (!userID) {
            res.status(403).json({ message: "Authorisation error", success: false });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const dateRanges = req?.body?.dateRange as IExportShiftRequest;

        // Only show events that are UPCOMING and sort by upcoming start at dates
        const shifts = await Shift.find({
            startAt: {
                $gte: Date.parse(dateRanges.start),
            },
            endAt: {
                $lte: Date.parse(dateRanges.end),
            },
        }).sort({
            startAt: 1,
        });

        let csvOutput = [
            [
                "Shift ID",
                "Name",
                "Venue",
                "Address",
                "Start Date/Time",
                "End Date/Time",
                "Length (Hours)",
                "Category",
                "Description",
                "Notes",
                "Volunteer ID",
                "First Name",
                "Last Name",
                "Volunteer Type",
                "Approval Status",
                "Completion Status",
            ],
        ] as string[][];

        for (let i = 0; i < shifts.length; i++) {
            const shift = shifts[i];
            const rows = [] as string[][];

            for (let idx = 0; idx < shift?.users?.length; idx++) {
                const participant = shift?.users[idx];
                const targetVolType = await VolunteerType.findOne({ _id: participant.chosenVolunteerType });
                const targetUser = await User.findOne({ _id: participant.user });
                const completed =
                    targetUser?.shifts?.find((uShift) => uShift.shift.toString() === shift._id)?.completed || false;

                rows.push([
                    shift._id,
                    `${shift.name}`,
                    `${shift.venue}`,
                    `${shift.address}`,
                    shift.startAt.toString(),
                    shift.endAt.toString(),
                    `${shift.hours}`,
                    `${shift.category}`,
                    `${shift.description}`,
                    `${shift.notes}`,
                    targetUser?._id.toString(),
                    targetUser?.firstName,
                    targetUser?.lastName,
                    targetVolType?.name,
                    participant.approved ? "Approved" : "Pending Approval",
                    completed ? "Completed" : "Pending Completion",
                ] as string[]);
            }

            csvOutput = [...csvOutput, ...rows];
        }

        if (shifts.length === 0) {
            csvOutput.push(["No shifts found within this range"]);
        }

        const csvContent =
            "data:text/csv;charset=utf-8," +
            csvOutput
                .map((e) => e.map((str) => (typeof str === "string" ? str.replace(/,/g, "") : str)).join(","))
                .join("\n");
        const encodedUri = encodeURI(csvContent);

        res.status(200).json({
            message: "success",
            data: { csv: encodedUri },
            success: true,
        });
        return;
    } catch (error) {
        console.log("export admin shifts error", error);
        res.status(500).json({
            message: "export admin shifts error",
            error,
            success: false,
        });
        return;
    }
};

export const exportVolunteerShifts = async (req: Request, res: Response) => {
    try {
        const { _id: userID } = req.session.user || {};
        if (!userID) {
            res.status(403).json({ message: "Authorisation error", success: false });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const dateRanges = req?.body?.dateRange as IExportShiftRequest;

        // Only show events that are UPCOMING and sort by upcoming start at dates
        const shifts = await Shift.find({
            startAt: {
                $gte: Date.parse(dateRanges.start),
            },
            endAt: {
                $lte: Date.parse(dateRanges.end),
            },
            "users.user": userID,
        }).sort({
            startAt: 1,
        });

        let csvOutput = [
            [
                "Shift ID",
                "Name",
                "Venue",
                "Address",
                "Start Date/Time",
                "End Date/Time",
                "Length (Hours)",
                "Category",
                "Description",
                "Notes",
            ],
        ] as string[][];

        for (let i = 0; i < shifts.length; i++) {
            const shift = shifts[i];

            const rows = [
                [
                    shift._id,
                    shift.name,
                    shift.venue,
                    shift.address,
                    shift.startAt,
                    shift.endAt,
                    shift.hours,
                    shift.category,
                    shift.description,
                    shift.notes,
                ],
            ] as string[][];

            csvOutput = [...csvOutput, ...rows];
        }

        if (shifts.length === 0) {
            csvOutput = [];
            csvOutput.push(["No shifts found within this range"]);
        }

        const csvContent = "data:text/csv;charset=utf-8," + csvOutput.map((e) => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);

        res.status(200).json({
            message: "success",
            data: { csv: encodedUri },
            success: true,
        });
        return;
    } catch (error) {
        console.log("export volunteer shifts error", error);
        res.status(500).json({
            message: "export volunteer shifts error",
            error,
            success: false,
        });
        return;
    }
};

export const getUserShifts = async (req: Request, res: Response) => {
    try {
        console.log(req.params);
        const targetUserID = req.params.userid;

        const userObj = await User.findOne({ _id: targetUserID });
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
        const availableShifts = await Shift.find({ "users.user": targetUserID }).sort({
            startAt: 1,
        });

        res.status(200).json({
            message: "success",
            data: availableShifts,
            success: true,
        });
        return;
    } catch (error) {
        console.log("Get user shifts error", error);
        res.status(500).json({
            message: "Get user shifts error",
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

        const { shiftid } = req.params;
        if (!shiftid) {
            res.status(403).json({ message: "No shift ID provided", success: false });
            return;
        }

        const shift = await Shift.findOne({ _id: shiftid });

        if (!shift?.users) {
            res.status(200).json({
                message: "success",
                data: [],
                success: true,
            });
            return;
        }

        const participantMapResult: UserShiftAttendaceSummary[] = [];

        for (let idx = 0; idx < shift?.users?.length; idx++) {
            const participant = shift?.users[idx];
            const targetVolType = await VolunteerType.findOne({ _id: participant.chosenVolunteerType });
            const targetUser = await User.findOne({ _id: participant.user });
            participantMapResult.push({
                _id: targetUser?._id.toString() || "",
                firstName: targetUser?.firstName || "",
                lastName: targetUser?.lastName || "",
                email: targetUser?.email || "",
                volTypeName: targetVolType?.name || "",
                volTypeId: targetVolType?._id.toString() || "",
                approved: participant.approved,
                completed:
                    targetUser?.shifts?.find((uShift) => uShift.shift.toString() === shiftid)?.completed || false,
            });
        }

        res.status(200).json({
            message: "success",
            data: participantMapResult,
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

export const getAvailableRolesForShiftUser = async (req: Request, res: Response) => {
    // Get roles for a user that are approved and that there is available slots for in the target shift
    try {
        const userObj = await User.findOne({ _id: req.params.userid });
        if (!userObj || !req.params.userid) {
            res.status(403).json({ message: "Could not find user object", success: false });
            return;
        }

        const volTypeIDs = getUserApprovedVolunteerTypes(userObj);

        const volTypeObjs = await VolunteerType.find({ _id: { $in: volTypeIDs } });

        // todo: also check the shift to ensure there are slots available, doesn't really matter
        // since application process is denied if no slots available but serves as better UX for
        // the user not to have the option to apply as a vol type that there is no space for in the target shfit.

        res.status(200).json({
            message: "success",
            data: volTypeObjs,
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
