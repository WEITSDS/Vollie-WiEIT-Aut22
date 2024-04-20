// import express from "express";
// import { createFeedback, deleteFeedbackById, updateFeedbackById } from "./feedback.controller";
// import { wrapAsync } from "../utility";

// const router = express.Router();

// router.post("/create", wrapAsync(createFeedback));
// router.post("/:id/update", wrapAsync(updateFeedbackById));
// router.delete("/:id/delete", wrapAsync(deleteFeedbackById));

// export = router;
import express from "express";
import { createFeedback, deleteFeedbackById, updateFeedbackById } from "./feedback.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.post("/create", wrapAsync(createFeedback));
router.post("/:id/update", wrapAsync(updateFeedbackById));
router.delete("/:id/delete", wrapAsync(deleteFeedbackById));

export = router;
