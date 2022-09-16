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
} from "./shift.controller";

const router = express.Router();

router.post("/create", wrapAsync(createShift));
router.patch("/:shiftid/assign-user/:userid", wrapAsync(assignUser));
router.patch("/:shiftid/unassign-user/:userid", wrapAsync(removeUser));
router.delete("/:shiftid", wrapAsync(deleteShift));
router.get("/get-all-shifts", wrapAsync(getAllShifts));
router.get("/get-user-shifts/:targetUserID", wrapAsync(getUserShifts));
router.get("/get-available-shifts", wrapAsync(getAvailableShifts));
router.get("/shift/:shiftId", wrapAsync(getShiftById));
router.get("/attendance-list/:shiftId", wrapAsync(getShiftAttendanceList));
export = router;
