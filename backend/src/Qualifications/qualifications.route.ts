import express from "express";
import {
    createQualification,
    deleteQualificationById,
    getOwnQualifications,
    getQualificationsForUserId,
    updateQualificationById,
    setApprovalQualificationForUser,
} from "./qualifications.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.delete("/:id", wrapAsync(deleteQualificationById));
router.post("/:id/update", wrapAsync(updateQualificationById));
router.post("/create", wrapAsync(createQualification));
router.get("/self", wrapAsync(getOwnQualifications));
router.get("/user/:id", wrapAsync(getQualificationsForUserId));
router.post("/set-approval/:qualificationID/:userID/:status", wrapAsync(setApprovalQualificationForUser));

export = router;
