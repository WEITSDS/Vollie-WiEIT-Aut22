/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import * as addressController from "./address.controller";

const router = express.Router();

router.post("/add-addresses", addressController.addAddress);
router.get("/get-addresses", addressController.getAllAddresses);
router.delete("/delete-addresses/:id", addressController.deleteAddress);
router.put("/update-addresses/:id", addressController.updateAddress);

export default router;
