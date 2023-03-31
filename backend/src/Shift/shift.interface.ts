import { Document, Types } from "mongoose";

export interface IShift extends Document {
    name: string;
    startAt: Date;
    endAt: Date;
    venue: string;
    address: string;
    description: string;
    hours: number;
    notes: string;
    users: Array<IShiftUser>;
    category: "School Outreach" | "Event" | "Committee" | "Other";
    requiredQualifications: Array<IShiftRequiredQualification>;
    volunteerTypeAllocations: Array<IShiftVolunteerAllocations>;
}

export interface IShiftRequiredQualification {
    qualificationType: Types.ObjectId; // Qualification type ID
    numRequired: number;
    currentNum: number;
    users: Array<Types.ObjectId>;
}

export interface IShiftVolunteerAllocations {
    type: Types.ObjectId; // Volunteer type ID
    numMembers: number;
    currentNum: number;
    users: Array<Types.ObjectId>;
}

export interface IShiftUser {
    user: Types.ObjectId; // userID
    chosenVolunteerType: Types.ObjectId; // volunteerTypeID
    approved: boolean;
}
