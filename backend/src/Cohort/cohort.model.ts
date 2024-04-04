import mongoose from "mongoose";
import { Schema } from "mongoose";
import { ICohort } from "./cohort.interface";

const Cohort: Schema = new Schema({
    cohort: { type: String, required: true },
});

//a user should have an array/list of cohort

// Create a Model.
export default mongoose.model<ICohort>("Cohort", Cohort);
