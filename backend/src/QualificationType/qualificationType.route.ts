import express from "express";
import { wrapAsync } from "../utility";
import {
    createQualificationType,
    updateQualificationType,
    deleteQualificationType,
    getAllQualificationTypes,
    getQualificationTypeById,
} from "./qualificationType.controller";

const router = express.Router();

router.post("/create", wrapAsync(createQualificationType));
router.post("/update/:qualificationTypeId", wrapAsync(updateQualificationType));
router.delete("/:qualificationTypeId", wrapAsync(deleteQualificationType));
router.get("/qualification-type-all", wrapAsync(getAllQualificationTypes));
router.get("/qualificationTypeById/:qualificationTypeId", wrapAsync(getQualificationTypeById));

export = router;
