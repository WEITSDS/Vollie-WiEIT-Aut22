import express from "express";
import { createShift, assignUser, removeUser, deleteShift } from "./shift.controller";

const router = express.Router();

router.post("/create", getAllUsers);
router.patch("/assign-user/:shiftid", assignUser);
router.delete("/assign-user/:shiftid", removeUser); //This might also have to be batch, we are not deleting a document here but updating the document data - Hector
router.delete("/delete", deleteShift); //Might be better here to use '/:shiftid', the delete mothod indicates it will be deleted, '/delete' is not required

export = router;
