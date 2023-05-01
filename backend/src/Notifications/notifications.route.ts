import express from "express";
import {
    createNotification,
} from "./notifications.controller";
import { wrapAsync } from "../utility";

const router = express.Router();

//router.post("/create", wrapAsync(createNotification));

export = router;
