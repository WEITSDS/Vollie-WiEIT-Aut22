import express from "express";
import { 
    createNotificationType, 
    getAllNotificationTypes, 
    updateNotificationType, 
    deleteNotificationType 
} from "./notificationType.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.post("/", wrapAsync(createNotificationType));
router.get("/", wrapAsync(getAllNotificationTypes));
router.put("/:id", wrapAsync(updateNotificationType));
router.delete("/:id", wrapAsync(deleteNotificationType));

export = router;