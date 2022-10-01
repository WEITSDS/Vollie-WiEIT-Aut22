import { Document } from "mongoose";
import {
    IQualification,
    // mapQualificationToQualificationSummary,
    // QualificationSummary,
} from "../Qualifications/qualifications.interface";
import { IShift } from "../Shift/shift.interface";
import { convertTagToTagSummary, IBasicTag, ITag } from "../Tag/tag.interface";
import { IVolunteerType } from "../VolunteerType/volunteerType.interface";

export interface IBasicUser {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface IUser extends Document, IBasicUser {
    _id: string;
    verified: boolean;
    isAdmin: boolean;
    lastLogin: number;
    qualifications: Array<IQualification["_id"]>;
    tags: ITag[];
    createdAt: Date;
    volunteerType: string;
    shifts: Array<IShift["_id"]>;
    volunteerTypes: IUserVolunteerType[];
}

export interface IUserVolunteerType {
    type: IVolunteerType["_id"];
    approved: boolean;
}

export function isIBasicUser(args: unknown): args is IBasicUser {
    const iuser = args as Partial<IBasicUser>;
    return (
        typeof iuser === "object" &&
        typeof iuser.email === "string" &&
        typeof iuser.firstName === "string" &&
        typeof iuser.lastName === "string" &&
        typeof iuser.password === "string"
    );
}

export interface UserSummary {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    lastLogin: number;
    registeredAt: number;
    qualifications: Array<IQualification["_id"]>;
    verified: boolean;
    isAdmin: boolean;
    tags: IBasicTag[];
    volunteerTypes: Array<IUserVolunteerType>;
    shifts: Array<IShift["_id"]>;
}

export function mapUserToUserSummary({
    firstName,
    lastName,
    lastLogin,
    _id,
    email,
    qualifications,
    verified,
    createdAt,
    isAdmin,
    tags,
    volunteerTypes,
    shifts,
}: IUser): UserSummary {
    return {
        lastLogin: lastLogin ?? 0,
        firstName,
        lastName,
        _id: _id || "",
        email,
        verified,
        qualifications,
        registeredAt: createdAt.getTime(),
        isAdmin,
        tags: tags ? tags.map(convertTagToTagSummary) : [],
        volunteerTypes,
        shifts,
    };
}
export interface AttendaceSummary {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    volunteerTypes: Array<IUserVolunteerType>;
}

export function mapUserToAttendanceSummary(userData: IUser): AttendaceSummary {
    return {
        _id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        volunteerTypes: userData.volunteerTypes,
    };
}
