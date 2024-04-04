import express from "express";
import { wrapAsync } from "../utility";
import { createCohort, getAllCohorts, deleteCohort, getCohortsForUser } from "./cohort.controller";

//should be able to retrieve the cohorts a user is in
//should be able to obtain all cohorts

const router = express.Router();

router.post("/create", wrapAsync(createCohort));
router.get("/cohort-all", wrapAsync(getAllCohorts));
router.get("/cohortById/:userId", wrapAsync(getCohortsForUser));
router.delete("/:id", wrapAsync(deleteCohort));

export = router;
