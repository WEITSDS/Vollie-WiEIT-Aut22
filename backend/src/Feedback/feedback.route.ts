import express from "express";
import { createFeedback, deleteFeedbackById, updateFeedbackById } from "./feedback.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.post("/", wrapAsync(createFeedback));
router.patch("/:id", wrapAsync(updateFeedbackById));
router.delete("/:id", wrapAsync(deleteFeedbackById));

export = router;
