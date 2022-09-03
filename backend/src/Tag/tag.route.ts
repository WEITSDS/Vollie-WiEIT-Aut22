import express from "express";
import { wrapAsync } from "../utility";
import { getAllTags, getTagById, createTag, deleteTagById, updateTagById } from "./tag.controller";

const router = express.Router();

router.get("/", getAllTags);
router.get("/:id", wrapAsync(getTagById));

const adminRoutes = express.Router();
adminRoutes.delete("/:id", wrapAsync(deleteTagById));
adminRoutes.post("/:id/update", wrapAsync(updateTagById));
adminRoutes.post("/create", wrapAsync(createTag));

router.use(adminRoutes);

export = router;
