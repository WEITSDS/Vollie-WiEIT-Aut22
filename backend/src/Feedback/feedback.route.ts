import express from "express";
import {
    createFeedback,
    deleteFeedbackById,
    updateFeedbackById,
    getAllFeedback,
    getAllFeedbackByUserId,
    getAllCompletedFeedbackByUserId,
    downloadFeedbackAsCsv,
    downloadFeedbackAsExcel,
    getFeedbackById,
} from "./feedback.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

// Routes for CRUD operations
router.post("/", wrapAsync(createFeedback));
router.patch("/:id", wrapAsync(updateFeedbackById));
router.delete("/:id", wrapAsync(deleteFeedbackById));
router.get("/all", wrapAsync(getAllFeedback));
router.get("/all/sortedByUserId", wrapAsync(getAllFeedbackByUserId));
router.get("/all/sortedByCompletedUser", wrapAsync(getAllCompletedFeedbackByUserId));

// Route for downloading feedback as CSV
router.get("/download-csv", wrapAsync(downloadFeedbackAsCsv));

// Route for downloading feedback as Excel
router.get("/download-excel", wrapAsync(downloadFeedbackAsExcel));

router.get("/:id", wrapAsync(getFeedbackById)); // Add this route

export = router;
