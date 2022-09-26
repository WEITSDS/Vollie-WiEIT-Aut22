import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IVolunteerType } from "./volunteerType.interface";

const VolunteerTypeSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    requiresApproval: { type: Boolean, default: false },
});

export default mongoose.model<IVolunteerType>("QualificationType", VolunteerTypeSchema);
