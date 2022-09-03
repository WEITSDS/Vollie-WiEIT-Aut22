import express from "express";
import { wrapAsync } from "../utility";
import { setUserIsAdmin, batchChangeUserTag } from "./user.controller";

const adminRouter = express.Router();
adminRouter.post("/batchchangetag", wrapAsync(batchChangeUserTag));
adminRouter.post("/setadmin", wrapAsync(setUserIsAdmin));

export = adminRouter;
