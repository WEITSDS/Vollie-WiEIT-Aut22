import { Document } from "mongoose";

export interface IBasicShift {
    name: string;
    startAt: Date;
    endAt: string;
    hours: number;
    address: string;
    addressDescription: string;
    description: string;
    status: string;
    numGeneralVolunteers: number;
    numUndergradAmbassadors: number;
    numPostgradAmbassadors: number;
    numStaffAmbassadors: number;
    numSprouts: number;
}

export interface IShift extends Document, IBasicShift {
    isArchived: boolean;
    archivedAt: Date;
    users: string[];
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
        typeof ishift.addressDescription === "string" &&
        typeof ishift.description === "string" &&
        typeof ishift.numGeneralVolunteers === "number" &&
        typeof ishift.numUndergradAmbassadors === "number" &&
        typeof ishift.numPostgradAmbassadors === "number" &&
        typeof ishift.numStaffAmbassadors === "number" &&
        typeof ishift.numSprouts === "number"
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
    numGeneralVolunteers: number;
    numUndergradAmbassadors: number;
    numPostgradAmbassadors: number;
    numStaffAmbassadors: number;
    numSprouts: number;
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
    numGeneralVolunteers,
    numUndergradAmbassadors,
    numPostgradAmbassadors,
    numStaffAmbassadors,
    numSprouts,
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
        numGeneralVolunteers,
        numUndergradAmbassadors,
        numPostgradAmbassadors,
        numStaffAmbassadors,
        numSprouts,
    };
}
