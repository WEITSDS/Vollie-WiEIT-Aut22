import { Request, Response } from "express";
import { handleError } from "../utility";
import User from "../User/user.model";
import Cohort from "../Cohort/cohort.model";
import { Logger } from "tslog";
import { ICohort } from "./cohort.interface";
const logger = new Logger({ name: "cohort.controller" });

export const createCohort = async (req: Request, res: Response) => {
    // Get user obj to check if admin
    const userObj = await User.findOne({ _id: req.session.user?._id });

    if (!userObj || !userObj?.isAdmin) {
        handleError(logger, res, null, "Unauthorized", 401);
        return;
    }

    const cohortFields = req.body as ICohort;

    try {
        const newCohort = new Cohort({
            ...cohortFields,
        });

        const newCohortSaved = await newCohort.save();

        res.status(200).json({
            message: "Cohort created",
            data: newCohortSaved,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "Cohort creation failed");
        return;
    }
};

export const getAllCohorts = async (_req: Request, res: Response) => {
    try {
        const allCohorts = await Cohort.find().sort({
            createdAt: 1,
        });
        res.status(200).json({
            message: "success",
            data: allCohorts,
            success: true,
        });
        return;
    } catch (error) {
        handleError(logger, res, error, "Get all Cohorts error.");
        return;
    }
};

export const deleteCohort = async (req: Request, res: Response) => {
    try {
        // Get user obj to check if admin
        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj || !userObj?.isAdmin) {
            handleError(logger, res, null, "Unauthorized", 401);
            return;
        }

        const deletionResult = await Cohort.deleteOne({ _id: req.params.id }); //removing the cohort by id

        if (deletionResult.acknowledged && deletionResult.deletedCount > 0) {
            res.status(200).json({
                message: "Cohort Type deleted",
                success: true,
            });
            return;
        } else {
            res.status(404).json({
                message: "Cohort not found",
                success: false,
            });
            return;
        }
    } catch (error) {
        handleError(logger, res, error, "Cohort deletion failed");
        return;
    }
};

export const getCohortsForUser = async (req: Request, res: Response) => {
    try {
        const sessionUser = await User.findOne({ _id: req.session.user?._id });
        const userObj = await User.findOne({ _id: req.params.userId });

        if (!sessionUser || !userObj) {
            handleError(logger, res, null, "User not found", 404);
            return;
        }

        if (sessionUser?._id.toString() !== userObj?._id.toString() && !sessionUser?.isAdmin) {
            handleError(logger, res, null, "Unauthorized", 401);
            return;
        }

        const cohorts = await Cohort.find({
            _id: { $in: userObj.cohorts.map((cohortType) => cohortType.type) },
        });

        res.status(200).json({
            message: "Got cohorts for User",
            success: true,
            data: cohorts,
        });
        return;
    } catch (error) {
        handleError(logger, res, null, "Get cohorts by ID error.", 500);
        return;
    }
};
