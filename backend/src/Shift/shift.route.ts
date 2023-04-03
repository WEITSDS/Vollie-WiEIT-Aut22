import express from "express";
import { wrapAsync } from "../utility";
import {
    createShift,
    assignUser,
    removeUser,
    deleteShift,
    getUserShifts,
    getShiftById,
    getShiftAttendanceList,
    updateShift,
    getAvailableRolesForShiftUser,
    setUserApproval,
    getSearchShifts,
} from "./shift.controller";

const router = express.Router();

router.get("/get-user-shifts/:userid", wrapAsync(getUserShifts));
router.post("/get-search-shifts", wrapAsync(getSearchShifts));
router.get("/shift/:shiftid", wrapAsync(getShiftById));
router.get("/attendance-list/:shiftid", wrapAsync(getShiftAttendanceList));
router.get("/available-roles-for-shift-user/:userid/:shiftid", wrapAsync(getAvailableRolesForShiftUser));

router.post("/create", wrapAsync(createShift));
router.post("/update/:shiftid", wrapAsync(updateShift));

router.patch("/:shiftid/assign-user/:userid/:selectedVolunteerTypeID", wrapAsync(assignUser));
router.patch("/:shiftid/unassign-user/:userid", wrapAsync(removeUser));
router.patch("/:shiftid/approve-user/:userid/:approvalstatus", wrapAsync(setUserApproval));

router.delete("/:shiftid", wrapAsync(deleteShift));

export = router;
