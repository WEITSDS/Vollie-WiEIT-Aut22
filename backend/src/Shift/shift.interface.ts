import { Document } from "mongoose";
import { UserSummary } from "../User/user.interface";

export interface IBasicShift {
    name: string;
    startAt: Date;
    endAt: string;
    hours: number;
    address: string;
    description: string;
    status: string;
}

export interface IShift extends Document, IBasicShift {
    isArchived: boolean;
    archivedAt: Date;
    users: UserSummary[];
    createdAt: Date;
}

export function isIBasicShift(args: unknown): args is IBasicShift {
    const ishift = args as Partial<IBasicShift>;
    return (
        typeof ishift === "object" &&
        typeof ishift.name === "string" &&
        typeof ishift.startAt === "string" &&
        typeof ishift.endAt === "string" &&
        typeof ishift.hours === "number" &&
        typeof ishift.address === "string" &&
        typeof ishift.description === "string"
    );
}

export interface ShiftSummary {
    _id: string;
    name: string;
    startAt: Date;
    endAt: string;
    hours: number;
    address: string;
    description: string;
    isArchived: boolean;
    archivedAt: Date;
    status: string;
    createdAt: Date;
}

export function mapShiftToShiftSummary({
    _id,
    name,
    startAt,
    endAt,
    hours,
    address,
    description,
    status,
    createdAt,
    archivedAt,
    isArchived,
}: IShift): ShiftSummary {
    return {
        _id: (_id as string) || "",
        name: name,
        startAt: startAt,
        endAt: endAt,
        hours: hours,
        address: address,
        description: description,
        status: status,
        createdAt: createdAt,
        isArchived: isArchived,
        archivedAt: archivedAt,
    };
}
