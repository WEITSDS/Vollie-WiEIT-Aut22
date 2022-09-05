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
        description: { type: String, required: false },
        status: { type: String, default: "Scheduled" },
        users: [{ type: mongoose.Types.ObjectId, ref: "User", required: false }],
        isArchived: { type: Boolean, default: false, required: true },
        archivedAt: { type: Date, required: false },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IShift>("Shift", ShiftSchema);
