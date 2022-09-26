import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IQualificationType } from "./qualificationType.interface";

const QualificatioTypeSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    requiresApproval: { type: Boolean, default: false },
});

export default mongoose.model<IQualificationType>("QualificationType", QualificatioTypeSchema);
