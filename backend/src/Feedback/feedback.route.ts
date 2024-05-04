// import express from "express";
// import {
//     createFeedback,
//     deleteFeedbackById,
//     updateFeedbackById,
//     getAllFeedback,
//     downloadFeedbackAsCsv,
//     downloadFeedbackAsExcel,
// } from "./feedback.controller";
// import { wrapAsync } from "../utility";

// const router = express.Router();

// // Routes for CRUD operations
// router.post("/create", wrapAsync(createFeedback));
// router.post("/:id/update", wrapAsync(updateFeedbackById));
// router.delete("/:id/delete", wrapAsync(deleteFeedbackById));
// router.get("/all", wrapAsync(getAllFeedback));

// // Route for downloading feedback as CSV
// router.get("/download-csv", wrapAsync(downloadFeedbackAsCsv));

// // Route for downloading feedback as Excel
// router.get("/download-excel", wrapAsync(downloadFeedbackAsExcel));

// export = router;

import express from "express";
import {
    createFeedback,
    deleteFeedbackById,
    updateFeedbackById,
    getAllFeedback,
    // getAllFeedbackSortedByUserId,
    getAllFeedbackByUserId,
    downloadFeedbackAsCsv,
    downloadFeedbackAsExcel,
    getFeedbackById, // Add this import
} from "./feedback.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

// Routes for CRUD operations
router.post("/create", wrapAsync(createFeedback));
router.post("/:id/update", wrapAsync(updateFeedbackById));
router.delete("/:id/delete", wrapAsync(deleteFeedbackById));
router.get("/all", wrapAsync(getAllFeedback));
router.get("/all/sortedByUserId", wrapAsync(getAllFeedbackByUserId));

// Route for downloading feedback as CSV
router.get("/download-csv", wrapAsync(downloadFeedbackAsCsv));

// Route for downloading feedback as Excel
router.get("/download-excel", wrapAsync(downloadFeedbackAsExcel));

router.get("/:id", wrapAsync(getFeedbackById)); // Add this route

export = router;
