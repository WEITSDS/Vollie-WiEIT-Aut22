import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IQualification } from "./qualifications.interface";

const QualificationSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        filePath: { type: String, required: true },
        fileId: { type: String, required: true },
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        qualificationType: { type: mongoose.Types.ObjectId, ref: "QualificationType" },
        approved: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IQualification>("Qualification", QualificationSchema);
