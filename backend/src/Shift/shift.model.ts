import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IShift } from "./shift.interface";

const ShiftSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        startAt: { type: Date, required: true },
        endAt: { type: Date, required: true },
        venue: { type: String, required: true },
        address: { type: String, required: true },
        description: { type: String, default: "" },
        hours: { type: Number, default: 0 },
        notes: { type: String, default: "" },
        users: [
            {
                user: { type: mongoose.Types.ObjectId, ref: "User", default: [] },
                chosenQualification: { type: mongoose.Types.ObjectId, ref: "QualificationType", required: true },
                volunteerType: {
                    type: { type: mongoose.Types.ObjectId, ref: "VolunteerType", required: true },
                    approved: { type: Boolean, default: false },
                }
            },
        ],
        category: { type: String, enum: ["School Outreach", "Event", "Committee", "Other"], default: "Other" },
        requiredQualifications: [
            {
                qualificationType: { type: mongoose.Types.ObjectId, ref: "QualificationType", required: true },
                numRequired: { type: Number, default: 0 },
            },
        ],
        volunteerTypeAllocations: [
            {
                type: { type: mongoose.Types.ObjectId, ref: "VolunteerType", required: true },
                numMembers: { type: Number, default: 0 },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IShift>("Shift", ShiftSchema);
