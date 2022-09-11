import { Document } from "mongoose";
import {
    IQualification,
    mapQualificationToQualificationSummary,
    QualificationSummary,
} from "../Qualifications/qualifications.interface";
import { convertTagToTagSummary, IBasicTag, ITag } from "../Tag/tag.interface";

export interface IBasicUser {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    volunteerType: string;
}

export interface IUser extends Document, IBasicUser {
    _id: string;
    verified: boolean;
    isAdmin: boolean;
    lastLogin: number;
    qualifications: IQualification[];
    tags: ITag[];
    createdAt: Date;
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
    qualifications: QualificationSummary[];
    verified: boolean;
    isAdmin: boolean;
    tags: IBasicTag[];
    volunteerType: string;
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
    volunteerType,
}: IUser): UserSummary {
    return {
        lastLogin: lastLogin ?? 0,
        firstName,
        lastName,
        _id: _id || "",
        email,
        verified,
        qualifications: qualifications.map(mapQualificationToQualificationSummary),
        registeredAt: createdAt.getTime(),
        isAdmin,
        tags: tags ? tags.map(convertTagToTagSummary) : [],
        volunteerType,
    };
}
