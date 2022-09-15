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
        notes: { type: String, default: "" },
        users: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
        category: { type: String, default: "Other" },
        requiresWWCC: { type: Boolean, default: false },
        numGeneralVolunteers: { type: Number, default: 0 },
        numUndergradAmbassadors: { type: Number, default: 0 },
        numPostgradAmbassadors: { type: Number, default: 0 },
        numStaffAmbassadors: { type: Number, default: 0 },
        numSprouts: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IShift>("Shift", ShiftSchema);
