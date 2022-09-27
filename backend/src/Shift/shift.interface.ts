import { Document } from "mongoose";
import { IQualification } from "../Qualifications/qualifications.interface";
import { IQualificationType } from "../QualificationType/qualificationType.interface";
import { IUser } from "../User/user.interface";
import { IVolunteerType } from "../VolunteerType/volunteerType.interface";

export interface IShift extends Document {
    name: String;
    startAt: Date;
    endAt: Date;
    venue: String;
    address: String;
    description: String;
    hours: Number;
    notes: String;
    users: Array<IShiftUser>;
    category: "School Outreach" | "Event" | "Committee" | "Other";
    requiredQualifications: Array<IShiftRequiredQualification>;
    qualificationTypeAllocations: Array<IShiftQualificationAllocations>;
}

export interface IShiftRequiredQualification {
    qualificationType: IQualification["_id"];
    numRequired: Number;
}

export interface IShiftQualificationAllocations {
    type: IVolunteerType["_id"];
    numMembers: Number
}

export interface IShiftUser {
    user: IUser["_id"];
    chosenQualification: IQualificationType["_id"];
    volunteerType: IShiftUserVolunteerType;
}

export interface IShiftUserVolunteerType {
    volunteerType: IVolunteerType;
    approved: Boolean;
}