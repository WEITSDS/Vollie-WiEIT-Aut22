import express from "express";
import { wrapAsync } from "../utility";
import { getAllUsers, getUserById, createUser, setUserPassword, getOwnTags, getOwnUser } from "./user.controller";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/self", wrapAsync(getOwnUser));
router.get("/:id", getUserById);
router.post("/create", wrapAsync(createUser));
router.post("/resetpassword", setUserPassword);
router.get("/owntags", wrapAsync(getOwnTags));

export = router;
