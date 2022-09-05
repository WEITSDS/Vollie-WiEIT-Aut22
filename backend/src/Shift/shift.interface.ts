import { Document } from "mongoose";
import { mapUserToUserSummary, IBasicUser, IUser } from "../User/user.interface";

export interface IBasicShift {
    name: date;  
    startAt: date;
    endAt: string;
    hours: number;
    address: string;
    description: string;
}

export interface IShift extends Document, IBasicShift {
    isArchived: boolean;
    atchivedAt: Date;
    status: string;
    user: IUser[];
    createdAt: Date;
}

export function isIBasicShift(args: unknown): args is IBasicShift {
    const ishift = args as Partial<IBasicShift>;
    return (
        typeof ishift === "object" &&
        typeof ishift.name === "string" &&    
        typeof ishift.startAt === "date" &&
        typeof ishift.endAt === "date" &&
        typeof ishift.hours === "number" &&
        typeof ishift.address === "string" &&
        typeof ishift.description === "string"
    );
}

export interface UserSummary {
    name: date;  
    startAt: date;
    endAt: string;
    hours: number;
    address: string;
    description: string;
    isArchived: boolean;
    atchivedAt: Date;
    status: string;
    user: IUser[];
    createdAt: Date;
}

export function mapShiftToShiftSummary({
    name, 
    startAt,
    endAt,
    hours,
    address,
    description,
    isArchived,
    atchivedAt,
    status,
    user,
    createdAt
}: IShift): UserShift {
    return {
        name: name,
        startAt: startAt,
        _id: _id || "",
        endAt: endAt,
        hours: hours,
        users: users.map(mapUserToUserSummary),
        address: address,
        description: description,
        status: status,
    };
}