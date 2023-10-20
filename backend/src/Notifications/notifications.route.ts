import express from "express";
import { getNotifications, updateNotificationStatus, getBatchNotifications } from "./notifications.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.get("/my-notifications", wrapAsync(getNotifications));
router.post("/update-notification-status", wrapAsync(updateNotificationStatus));
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.get("/get-batch-notifications", wrapAsync(getBatchNotifications));
export = router;
