import mongoose from "mongoose";
import { Schema } from "mongoose";
import { ICohort } from "./cohort.interface";

const Cohort: Schema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true }, //start date for the session
    endDate: { type: Date, required: true }, //end date for the session
});

//a user should have an array/list of cohort

// Create a Model.
export default mongoose.model<ICohort>("Cohort", Cohort);
