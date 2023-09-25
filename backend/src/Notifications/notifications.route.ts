import express from "express";
import { getNotifications, updateNotificationStatus } from "./notifications.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.get("/my-notifications", wrapAsync(getNotifications));
router.post("/update-notification-status", wrapAsync(updateNotificationStatus));

export = router;
