import { Document, Types } from "mongoose";
import { IQualificationType } from "../QualificationType/qualificationType.interface";

export function isIBasicQualification(args: unknown): args is IBasicQualification {
    const p = args as Partial<IBasicQualification>;
    return (
        typeof p === "object" &&
        // typeof p.title === "string" &&
        // typeof p.description === "string" &&
        // typeof p.filePath === "string" &&
        (typeof p.user === "string" || typeof p.user === "object") && // typeof p.fileId === "string" && // typeof p.user === "object"
        typeof p.wwccNumber === "string" && //* typeof p.dateOfbirth === "string" // typeof p.expiryDate === "string"
        typeof p.fullName === "string"
    );
}

export interface IBasicQualification {
    // title: string;
    // description: string;
    // filePath: string;
    // fileId: string;
    user: Types.ObjectId;
    qualificationType: Types.ObjectId;
    expiredAndNotified: boolean;
    approved: boolean;
    wwccNumber: string;
    expiryDate: string;
    dateOfbirth: string;
    fullName: string;
}

export interface IQualification extends Document, IBasicQualification {}

export interface QualificationSummary {
    _id: string;
    title: string;
    description: string;
    filePath: string;
    qualificationType: IQualificationType;
    // expiryDate: string;
    expiredAndNotified: boolean;
    approved: boolean;
    wwccNumber: string;
    expiryDate: string;
    dateOfbirth: string;
    fullName: string;
}
