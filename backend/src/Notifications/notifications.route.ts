import express from "express";
import {
    getNotifications,
} from "./notifications.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

router.get("/self", wrapAsync(getNotifications));

export = router;
