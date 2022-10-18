import express from "express";
import { wrapAsync } from "../utility";
import {
    createShift,
    assignUser,
    removeUser,
    deleteShift,
    getAllShifts,
    getUserShifts,
    getAvailableShifts,
    getShiftById,
    getShiftAttendanceList,
    updateShift,
    getAvailableRolesForShiftUser,
    setUserApproval,
} from "./shift.controller";

const router = express.Router();

router.get("/get-all-shifts", wrapAsync(getAllShifts));
router.get("/get-user-shifts/:userid", wrapAsync(getUserShifts));
router.get("/get-available-shifts", wrapAsync(getAvailableShifts));
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
