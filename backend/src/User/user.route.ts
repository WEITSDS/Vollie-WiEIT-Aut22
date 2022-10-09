import express from "express";
import { wrapAsync } from "../utility";
import {
    getAllUsers,
    getUserById,
    createUser,
    setUserPassword,
    getOwnUser,
    completeShift,
    setApprovalVolunteerTypeForUser,
    assignVolunteerType
} from "./user.controller";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/self", wrapAsync(getOwnUser));
router.get("/:id", getUserById);

router.post("/create", wrapAsync(createUser));
router.post("/resetpassword", setUserPassword);
router.post("/set-volunteerType-approval/:volunteerTypeID/:userid/:status", wrapAsync(setApprovalVolunteerTypeForUser));

router.patch("/:userid/assign-volunteer-type/:volunteertypeid", wrapAsync(assignVolunteerType));
router.patch("/:userid/complete-shift/:shiftid", wrapAsync(completeShift));


export = router;
