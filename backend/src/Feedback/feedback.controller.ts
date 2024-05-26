/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from "express";
import { Logger } from "tslog";
import { handleError } from "../utility";
import Feedback from "./feedbacks.model";

const logger = new Logger({ name: "feedback.controller" });

export const createFeedback = async (req: Request, res: Response) => {
    try {
        const {
            user,
            qualificationType,
            experience,
            learnings,
            teacher,
            studentEngagement,
            teacherEngagement,
            improvements,
            improvementMethods,
            styles,
            content,
            teamDynamics,
            additionalComments,
            rating,
        } = req.body;

        const feedback = new Feedback({
            user,
            qualificationType,
            experience,
            learnings,
            teacher,
            studentEngagement,
            teacherEngagement,
            improvements,
            improvementMethods,
            styles,
            content,
            teamDynamics,
            additionalComments,
            rating,
        });
        await feedback.save();
        res.status(200).json({ message: "Feedback created successfully", success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occurred while creating feedback.");
    }
};

export const updateFeedbackById = async (req: Request, res: Response) => {
    try {
        const {
            user,
            qualificationType,
            experience,
            learnings,
            teacher,
            studentEngagement,
            teacherEngagement,
            improvements,
            improvementMethods,
            styles,
            content,
            teamDynamics,
            additionalComments,
            rating,
        } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(req.params.id, {
            user,
            qualificationType,
            experience,
            learnings,
            teacher,
            studentEngagement,
            teacherEngagement,
            improvements,
            improvementMethods,
            styles,
            content,
            teamDynamics,
            additionalComments,
            rating,
        });
        if (!feedback) {
            res.status(404).json({ message: "Feedback not found", success: false });
            return;
        }
        res.status(200).json({ message: "Feedback updated successfully", success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occurred while updating feedback.");
    }
};

export const deleteFeedbackById = async (req: Request, res: Response) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            res.status(404).json({ message: "Feedback not found", success: false });
            return;
        }
        res.status(200).json({ message: "Feedback deleted successfully", success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occurred while deleting feedback.");
    }
};