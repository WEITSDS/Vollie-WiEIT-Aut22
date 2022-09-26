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
        users: [{
            user: { type: mongoose.Types.ObjectId, ref: "User", default: [] },
            approved: { type: Boolean, default: false },
        }],
        category: { type: String, default: "Other" },
        requiredQualifications: [{
            qualificationType: { type: String, enum: ["General Volunteer", "Sprout", "Undergrad Ambassador", "Postgrad Ambassador", "Staff Ambassador"], default: []},
        }],
        requiresWWCC: { type: Boolean, default: false }, //use requiredQualifications instead of this?
        volunteerTypes: [{
            type: { type: String, enum: ["General Volunteer", "Sprout", "Undergrad Ambassador", "Postgrad Ambassador", "Staff Ambassador"]},
            number: { type: Number, default: 0 },
        }], //Use volunteerTypes?? instead of below
        //numGeneralVolunteers: { type: Number, default: 0 },
        //numUndergradAmbassadors: { type: Number, default: 0 },
        //numPostgradAmbassadors: { type: Number, default: 0 },
        //numStaffAmbassadors: { type: Number, default: 0 },
        //numSprouts: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IShift>("Shift", ShiftSchema);
