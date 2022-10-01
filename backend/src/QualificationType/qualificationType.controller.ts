import { Request, Response } from "express";
import { handleError } from "../utility";
import User from "../User/user.model";
import { Logger } from "tslog";
import { IQualificationType } from "./qualificationType.interface";
import QualificationType from "./qualificationType.model";
const logger = new Logger({ name: "shift.controller" });

export const createQualificationType = async (req: Request, res: Response) => {
    // Get user obj to check if admin
    const userObj = await User.findOne({ _id: req.session.user?._id });

    if (!userObj || !userObj?.isAdmin) {
        handleError(logger, res, null, "Unauthorized", 401);
        return;
    }

    const qualificationTypeFields = req.body as IQualificationType;

    try {
        const newQualificationType = new QualificationType({
            ...qualificationTypeFields,
        });

        const newQualificationTypeSaved = await newQualificationType.save();

        res.status(200).json({
            message: "Qualification Type created",
            data: newQualificationTypeSaved,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "QualificationType creation failed");
        return;
    }
};

export const updateQualificationType = async (req: Request, res: Response) => {
    // Get user obj to check if admin
    const userObj = await User.findOne({ _id: req.session.user?._id });

    if (!userObj || !userObj?.isAdmin) {
        handleError(logger, res, null, "Unauthorized", 401);
        return;
    }

    const qualificationTypeId: string = req.params.qualificationTypeId;
    if (!qualificationTypeId) {
        handleError(logger, res, null, "Qualification Type ID not not provided", 401);
        return;
    }

    const existingQualification = await QualificationType.findOne({ _id: qualificationTypeId });
    if (!existingQualification) {
        handleError(logger, res, null, "QualificationType not found", 401);
        return;
    }

    const newQualificationType = req.body as IQualificationType;

    try {
        const updatedQualificationType = await QualificationType.findOneAndUpdate(
            { _id: qualificationTypeId },
            newQualificationType
        );

        res.status(200).json({
            message: "Qualification Type updated",
            data: updatedQualificationType,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "Shift update failed");
        return;
    }
};

export const deleteQualificationType = async (req: Request, res: Response) => {
    try {
        // Get user obj to check if admin
        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj || !userObj?.isAdmin) {
            handleError(logger, res, null, "Unauthorized", 401);
            return;
        }

        const deletionResult = await QualificationType.deleteOne({ _id: req.params.qualificationTypeId });

        if (deletionResult.acknowledged && deletionResult.deletedCount > 0) {
            res.status(200).json({
                message: "Qualification Type deleted",
                success: true,
            });
            return;
        } else {
            res.status(404).json({
                message: "Qualification Type ID not found",
                success: false,
            });
            return;
        }
    } catch (error) {
        handleError(logger, res, error, "Qualification Type deletion failed");
        return;
    }
};

export const getAllQualificationTypes = async (_req: Request, res: Response) => {
    try {
        const qualificationTypes = await QualificationType.find().sort({
            createdAt: 1,
        });
        res.status(200).json({
            message: "success",
            data: qualificationTypes,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "Get all Qualification Types error.");
        return;
    }
};

export const getQualificationTypeById = async (req: Request, res: Response) => {
    try {
        const qualificationType = await QualificationType.findOne({ _id: req.params.qualificationTypeId });
        if (!qualificationType) {
            handleError(logger, res, null, "Qualification Type with that ID doesn't exist.", 404);
            return;
        }

        res.status(200).json({
            message: "Got Qualification Type",
            success: true,
            data: qualificationType,
        });
        return;
    } catch (error) {
        handleError(logger, res, null, "Get Qualification Type by ID error.", 500);
        return;
    }
};
