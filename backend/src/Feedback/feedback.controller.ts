/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger } from "tslog";
import { StreamParser } from "@json2csv/plainjs";
import { Request, Response } from "express";
import { handleError } from "../utility";
import Feedback from "./feedbacks.model";
import { Parser } from "json2csv";

const logger = new Logger({ name: "feedback.controller" });

export const createFeedback = async (req: Request, res: Response) => {
    const {
        user,
        qualificationType,
        shift,
        //session,
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
    try {
        const feedback = new Feedback({
            user,
            qualificationType,
            shift,
            //session,
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
            formCompleted: false, // Set the default value for the formCompleted field
        });
        await feedback.save();
        res.status(200).json({ message: "Feedback created successfully", success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occurred while creating feedback.");
    }
};

export const updateFeedbackById = async (req: Request, res: Response) => {
    const {
        user,
        qualificationType,
        shift,
        //session,
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
        formCompleted,
    } = req.body;
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, {
            user,
            qualificationType,
            shift,
            //session,
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
            formCompleted,
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

export const getAllFeedback = async (_req: Request, res: Response) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json({ feedbacks, success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occurred while retrieving feedback.");
    }
};

export const getAllFeedbackByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestingUser = req.session.user;
        const feedbacks = await Feedback.find({ user: requestingUser?._id });
        if (!feedbacks || feedbacks.length === 0) {
            res.status(404).json({ message: "No feedback found for the given user", success: false });
            return;
        }
        res.status(200).json({ feedbacks, success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occurred while retrieving feedback.");
        res.status(500).json({ error: "An unexpected error occurred while retrieving feedback." });
    }
};

export const getFeedbackById = async (req: Request, res: Response): Promise<void> => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            res.status(404).json({ message: "Feedback not found", success: false });
            return; // Ensure to return after sending response
        }
        res.status(200).json({ feedback, success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occurred while retrieving feedback.");
        res.status(500).json({ error: "An unexpected error occurred while retrieving feedback." });
    }
};

export const getAllCompletedFeedbackByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestingUser = req.session.user;
        const feedbacks = await Feedback.find({ user: requestingUser?._id, formCompleted: true });
        if (!feedbacks || feedbacks.length === 0) {
            res.status(404).json({ message: "No feedback found for the given user", success: false });
            return;
        }
        res.status(200).json({ feedbacks, success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occurred while retrieving feedback.");
        res.status(500).json({ error: "An unexpected error occurred while retrieving feedback." });
    }
};

// export const getAllFeedback = async (req: Request, res: Response) => {
//     try {
//         // Parse optional query parameters
//         const { userId, sortBy } = req.query;

//         // Construct the query
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const query: any = {};

//         if (userId) {
//             query.user = userId;
//         }

//         let feedbacks: Query<IFeedback[], IFeedback> | null = null;
//         if (sortBy === "date") {
//             feedbacks = Feedback.find(query).sort({ createdAt: -1 });
//         } else {
//             feedbacks = Feedback.find(query);
//         }

//         // eslint-disable-next-line @typescript-eslint/no-misused-promises
//         if (feedbacks) {
//             const result = await feedbacks.exec();
//             res.status(200).json({ feedbacks: result, success: true });
//         } else {
//             res.status(200).json({ feedbacks: [], success: true });
//         }
//     } catch (err) {
//         handleError(logger, res, err, "An unexpected error occurred while retrieving feedback.");
//     }
// };

export const downloadFeedbackAsExcel = async (_req: Request, res: Response) => {
    try {
        const feedbacks = await Feedback.find();

        // Set options for the CSV parser if needed
        const opts = {};

        // Create a new CSV parser
        const parser = new StreamParser(opts, { objectMode: true });

        let csv = "";

        // When data is passed to the parser (from internal methods such as parser.write)
        parser.onData = (chunk) => (csv += chunk.toString());

        // When no more data is being sent
        parser.onEnd = () => {
            // Set the required headers to inform the requester that the response is a downloadable file
            res.setHeader("Content-Disposition", "attachment; filename=feedback-report.csv");
            res.set("Content-Type", "text/csv");
            res.status(200).send(csv);
        };

        // If an error occurs, handle accordingly
        parser.onError = (err) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            handleError(logger, res, err, "An unexpected error occurred while generating feedback report.");
        };

        // Loop through each element to minimize memory impact (instead of pushing it all to a CSV)
        feedbacks.forEach((record: string | object | Iterable<number>) => {
            if (typeof record === "string") {
                parser.write(record);
            } else if (Array.isArray(record)) {
                const iterable = record as Iterable<number>;
                parser.write(Array.from(iterable).join(",")); // Handling Iterable<number>
            } else if (typeof record === "object") {
                parser.write(JSON.stringify(record));
            } else {
                throw new Error("Unsupported type");
            }
        });

        parser.end(); // End the parser when all data is processed
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        handleError(logger, res, err, "An unexpected error occurred while downloading feedback report.");
    }
};

export const downloadFeedbackAsCsv = async (_req: Request, res: Response) => {
    console.log("here");
    try {
        // Fetch feedback data from the database
        const feedbacks = await Feedback.find();

        // Define fields to include in the CSV
        const fields = ["user name", "shift name", " school", "role", "session", "rating"];

        // Convert feedback data to CSV format
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(feedbacks);

        // Set the required headers to inform the requester that the response is a downloadable file
        res.setHeader("Content-Disposition", "attachment; filename=feedback-report.csv");
        res.set("Content-Type", "text/csv");

        // Send the CSV data as the response
        res.status(200).send(csv);
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: "An unexpected error occurred while downloading feedback report." });
    }
};
