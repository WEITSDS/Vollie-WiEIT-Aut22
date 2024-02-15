/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import * as addressController from "./address.controller";

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.post("/add-venues", addressController.addVenue);
router.get("/get-venues", addressController.getAllVenues);
router.delete("/delete-venues/:id", addressController.deleteVenue);
router.put("/update-venues/:id", addressController.updateVenue);

export default router;
