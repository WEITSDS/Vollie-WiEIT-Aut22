import express from "express";
import { wrapAsync } from "../utility";
import {
    getAllUsers,
    getUserById,
    createUser,
    setUserPassword,
    getOwnUser,
    setCompleteShift,
    setApprovalVolunteerTypeForUser,
    assignVolunteerType,
    removeVolunteerType,
    assignCohortType,
    removeCohortType,
} from "./user.controller";
import { getCohortsForUser } from "../Cohort/cohort.controller";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/self", wrapAsync(getOwnUser));
router.get("/:id", getUserById);

router.post("/create", wrapAsync(createUser));
router.post("/reset-password", setUserPassword);
router.patch(
    "/set-volunteerType-approval/:volunteerTypeId/:userId/:status",
    wrapAsync(setApprovalVolunteerTypeForUser)
);

router.patch("/:userId/assign-volunteer-type/:volunteerTypeId", wrapAsync(assignVolunteerType));
router.patch("/:userId/remove-volunteer-type/:volunteerTypeId", wrapAsync(removeVolunteerType));
router.patch("/:userId/set-complete-shift/:shiftId/:completionStatus", wrapAsync(setCompleteShift));
router.patch("/:userId/assign-cohort-type/:cohortId", wrapAsync(assignCohortType));
router.patch("/:userId/remove-cohort-type/:cohortId", wrapAsync(removeCohortType));
router.get("/:userId/cohort", wrapAsync(getCohortsForUser));

export = router;
