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
        isUnreleased: { type: Boolean, default: false },

        // notes: { type: String, default: "" },
        users: [
            {
                user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
                chosenVolunteerType: { type: mongoose.Types.ObjectId, ref: "VolunteerType", required: true },
                approved: { type: Boolean, default: false },
                completed: { type: Boolean, default: false }, //not updating properly
            },
        ],
        category: { type: String, enum: ["School Outreach", "Event", "Committee", "Other"], default: "Other" },
        requiredQualifications: [
            {
                qualificationType: { type: mongoose.Types.ObjectId, ref: "QualificationType", required: true },
                numRequired: { type: Number, default: 0 },
                currentNum: { type: Number, default: 0 }, // represents how many people in the shift have this qualification
            },
        ],
        volunteerTypeAllocations: [
            {
                type: { type: mongoose.Types.ObjectId, ref: "VolunteerType", required: true },
                numMembers: { type: Number, default: 0 },
                currentNum: { type: Number, default: 0 }, // represents how many people in the shift have this volunteer type
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IShift>("Shift", ShiftSchema);
