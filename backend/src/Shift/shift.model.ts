import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IShift } from "./shift.interface";

const ShiftSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        startAt: { type: Date, required: true },
        endAt: { type: Date, required: true },
        hours: { type: Number, required: true },
        address: { type: String, required: true },
        addressDescription: { type: String, required: false },
        description: { type: String, required: false },
        status: { type: String, default: "Scheduled", required: true },
        users: [{ type: mongoose.Types.ObjectId, ref: "User", required: false }],
        isArchived: { type: Boolean, default: false, required: true },
        archivedAt: { type: Date, required: false },
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
