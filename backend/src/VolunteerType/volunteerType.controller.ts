import { Request, Response } from "express";
import { handleError } from "../utility";
import User from "../User/user.model";
import { Logger } from "tslog";
import { IVolunteerType } from "./volunteerType.interface";
import VolunteerType from "./volunteerType.model";
const logger = new Logger({ name: "shift.controller" });

export const createVolunteerType = async (req: Request, res: Response) => {
    // Get user obj to check if admin
    const userObj = await User.findOne({ _id: req.session.user?._id });

    if (!userObj || !userObj?.isAdmin) {
        handleError(logger, res, null, "Unauthorized", 401);
        return;
    }

    const volunteerTypeFields = req.body as IVolunteerType;

    try {
        const newVolunteerType = new VolunteerType({
            ...volunteerTypeFields,
        });

        const newVolunteerTypeSaved = await newVolunteerType.save();

        res.status(200).json({
            message: "Volunteer Type created",
            data: newVolunteerTypeSaved,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "VolunteerType creation failed");
        return;
    }
};

export const updateVolunteerType = async (req: Request, res: Response) => {
    // Get user obj to check if admin
    const userObj = await User.findOne({ _id: req.session.user?._id });

    if (!userObj || !userObj?.isAdmin) {
        handleError(logger, res, null, "Unauthorized", 401);
        return;
    }

    const volunteerTypeId: string = req.params.volunteerTypeId;
    if (!volunteerTypeId) {
        handleError(logger, res, null, "Volunteer Type ID not not provided", 401);
        return;
    }

    const existingQualification = await VolunteerType.findOne({ _id: volunteerTypeId });
    if (!existingQualification) {
        handleError(logger, res, null, "VolunteerType not found", 401);
        return;
    }

    const newVolunteerType = req.body as IVolunteerType;

    try {
        const updatedVolunteerType = await VolunteerType.findOneAndUpdate({ _id: volunteerTypeId }, newVolunteerType);

        res.status(200).json({
            message: "Volunteer Type updated",
            data: updatedVolunteerType,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "Shift update failed");
        return;
    }
};

export const deleteVolunteerType = async (req: Request, res: Response) => {
    try {
        // Get user obj to check if admin
        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj || !userObj?.isAdmin) {
            handleError(logger, res, null, "Unauthorized", 401);
            return;
        }

        const deletionResult = await VolunteerType.deleteOne({ _id: req.params.volunteerTypeId });

        if (deletionResult.acknowledged && deletionResult.deletedCount > 0) {
            res.status(200).json({
                message: "Volunteer Type deleted",
                success: true,
            });
            return;
        } else {
            res.status(404).json({
                message: "Volunteer Type ID not found",
                success: false,
            });
            return;
        }
    } catch (error) {
        handleError(logger, res, error, "Volunteer Type deletion failed");
        return;
    }
};

export const getAllVolunteerTypes = async (_req: Request, res: Response) => {
    try {
        const volunteerTypes = await VolunteerType.find().sort({
            createdAt: 1,
        });
        res.status(200).json({
            message: "success",
            data: volunteerTypes,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "Get all Volunteer Types error.");
        return;
    }
};

export const getVolunteerTypeById = async (req: Request, res: Response) => {
    try {
        const volunteerType = await VolunteerType.findOne({ _id: req.params.volunteerTypeId });
        if (!volunteerType) {
            handleError(logger, res, null, "Volunteer Type with that ID doesn't exist.", 404);
            return;
        }

        res.status(200).json({
            message: "Got Volunteer Type",
            success: true,
            data: volunteerType,
        });
        return;
    } catch (error) {
        handleError(logger, res, null, "Get Volunteer Type by ID error.", 500);
        return;
    }
};
