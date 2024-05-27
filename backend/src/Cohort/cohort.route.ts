import express from "express";
import { wrapAsync } from "../utility";
import { createCohort, getAllCohorts, deleteCohort } from "./cohort.controller";

const router = express.Router();

router.post("/", wrapAsync(createCohort));
router.get("/", wrapAsync(getAllCohorts));
router.delete("/:id", wrapAsync(deleteCohort));

export = router;
