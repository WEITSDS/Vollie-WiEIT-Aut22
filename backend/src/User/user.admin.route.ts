import express from "express";
import { wrapAsync } from "../utility";
import { setUserIsAdmin } from "./user.controller";

const adminRouter = express.Router();
adminRouter.post("/setadmin", wrapAsync(setUserIsAdmin));

export = adminRouter;
