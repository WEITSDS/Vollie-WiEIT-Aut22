import express from "express";
import {
    createQualification,
    deleteQualificationById,
    getOwnQualifications,
    getQualificationsForUserId,
    updateQualificationById,
} from "./qualifications.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.delete("/:id", wrapAsync(deleteQualificationById));
router.post("/:id/update", wrapAsync(updateQualificationById));
router.post("/create", wrapAsync(createQualification));
router.get("/self", wrapAsync(getOwnQualifications));
router.get("/user/:id", wrapAsync(getQualificationsForUserId));

export = router;
