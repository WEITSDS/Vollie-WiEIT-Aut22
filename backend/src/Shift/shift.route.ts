import express from "express";
import { wrapAsync } from "../utility";
import { createShift, assignUser, removeUser, deleteShift } from "./shift.controller";

const router = express.Router();

router.post("/create", createShift);
router.patch("/:shiftid/assign-user/:userid", wrapAsync(assignUser));
router.patch("/:shiftid/unassign-user/:userid", wrapAsync(removeUser));
router.delete("/:shiftid", deleteShift);

export = router;
