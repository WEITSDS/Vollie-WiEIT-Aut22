import express from "express";
import { wrapAsync } from "../utility";
import { createShift, assignUser, removeUser, deleteShift } from "./shift.controller";

const router = express.Router();

router.post("/create", createShift);
router.patch("/assign-user/:shiftid", wrapAsync(assignUser));
router.delete("/assign-user/:shiftid", wrapAsync(removeUser)); //This might also have to be batch, we are not deleting a document here but updating the document data - Hector
router.delete("/delete", deleteShift); //Might be better here to use '/:shiftid', the delete mothod indicates it will be deleted, '/delete' is not required

export = router;
