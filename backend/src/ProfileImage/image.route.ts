import express from "express";
import { createProfileImage, getOwnImages, getImagesForUserId, updateImageById } from "./image.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.post("/:id/update", wrapAsync(updateImageById));
router.post("/create", wrapAsync(createProfileImage));
router.get("/self", wrapAsync(getOwnImages));
router.get("/user/:id", wrapAsync(getImagesForUserId));

export = router;
