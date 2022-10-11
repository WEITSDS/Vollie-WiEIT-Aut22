import { Document, Types } from "mongoose";
import { IQualificationType } from "../QualificationType/qualificationType.interface";

export function isIBasicQualification(args: unknown): args is IBasicQualification {
    const p = args as Partial<IBasicQualification>;
    return (
        typeof p === "object" &&
        typeof p.title === "string" &&
        typeof p.description === "string" &&
        typeof p.filePath === "string" &&
        typeof p.fileId === "string" &&
        typeof p.user === "string"
    );
}

export interface IBasicQualification {
    title: string;
    description: string;
    filePath: string;
    fileId: string;
    user: Types.ObjectId;
    qualificationType: Types.ObjectId;
    approved: boolean;
}

export interface IQualification extends Document, IBasicQualification {}

export interface QualificationSummary {
    _id: string;
    title: string;
    description: string;
    filePath: string;
    qualificationType: IQualificationType;
    approved: boolean;
}
