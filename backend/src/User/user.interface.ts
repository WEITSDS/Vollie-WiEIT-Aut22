import { Document, Types } from "mongoose";
// import { IVolunteerType } from "../VolunteerType/volunteerType.interface";

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
    qualifications: Array<Types.ObjectId>; // qualification IDs
    createdAt: Date;
    shifts: Array<IUserShiftType>; // shift IDs
    volunteerTypes: IUserVolunteerType[];
}

export interface IUserShiftType {
    shift: Types.ObjectId;
    approved: boolean;
    completed: boolean;
}

export interface IUserVolunteerType {
    type: Types.ObjectId; // volunteer type ID
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
    qualifications: Array<string>;
    verified: boolean;
    isAdmin: boolean;
    volunteerTypes: Array<IUserVolunteerType>;
    shifts: Array<string>;
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
        qualifications: qualifications.map((qual) => qual.toString()),
        registeredAt: createdAt.getTime(),
        isAdmin,
        volunteerTypes,
        shifts: shifts.map((shift) => shift.toString()),
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
