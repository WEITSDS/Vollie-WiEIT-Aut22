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
} from "./shift.controller";

const router = express.Router();

router.post("/create", createShift);
router.patch("/:shiftid/assign-user/:userid", wrapAsync(assignUser));
router.patch("/:shiftid/unassign-user/:userid", wrapAsync(removeUser));
router.delete("/:shiftid", deleteShift);
router.get("/get-all-shifts", wrapAsync(getAllShifts));
router.get("/get-user-shifts/:targetUserID/:statusType", wrapAsync(getUserShifts));
router.get("/get-available-shifts", wrapAsync(getAvailableShifts));
export = router;
