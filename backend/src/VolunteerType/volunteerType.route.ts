import express from "express";
import { wrapAsync } from "../utility";
import {
    createVolunteerType,
    updateVolunteerType,
    deleteVolunteerType,
    getAllVolunteerTypes,
    getVolunteerTypeById,
} from "./volunteerType.controller";

const router = express.Router();

router.post("/create", wrapAsync(createVolunteerType));
router.post("/update/:volunteerTypeId", wrapAsync(updateVolunteerType));

router.delete("/:volunteerTypeId", wrapAsync(deleteVolunteerType));

router.get("/volunteer-type-all", wrapAsync(getAllVolunteerTypes));
router.get("/volunteerTypeById/:volunteerTypeId", wrapAsync(getVolunteerTypeById));

export = router;
