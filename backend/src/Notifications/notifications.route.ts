import express from "express";
import { getNotifications } from "./notifications.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.get("/my-notifications", wrapAsync(getNotifications));

export = router;
