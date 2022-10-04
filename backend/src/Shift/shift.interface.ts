import { Document } from "mongoose";
import { IUser } from "../User/user.interface";

export interface IShift extends Document {
    name: string;
    startAt: Date;
    endAt: Date;
    venue: string;
    address: string;
    description: string;
    hours: number;
    notes: string;
    users: Array<IUser["_id"]>;
    category: "School Outreach" | "Event" | "Committee" | "Other";
    requiresWWCC: boolean;
    numGeneralVolunteers: number;
    numUndergradAmbassadors: number;
    numPostgradAmbassadors: number;
    numStaffAmbassadors: number;
    numSprouts: number;
}
