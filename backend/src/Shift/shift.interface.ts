import { Document } from "mongoose";
import { IQualification } from "../Qualifications/qualifications.interface";
import { IUser } from "../User/user.interface";
import { IVolunteerType } from "../VolunteerType/volunteerType.interface";

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
    qualificationType: IQualification["_id"];
    numRequired: number;
    currentNum: number;
}

export interface IShiftVolunteerAllocations {
    type: IVolunteerType["_id"];
    numMembers: number;
    currentNum: number;
}

export interface IShiftUser {
    user: IUser["_id"];
    chosenVolunteerType: IVolunteerType["_id"];
}
