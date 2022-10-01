import { Document } from "mongoose";
import { IQualificationType } from "../QualificationType/qualificationType.interface";
import { IUser } from "../User/user.interface";

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
    user: IUser["_id"];
    qualificationType: IQualificationType["_id"];
    approved: boolean;
}

export interface IQualification extends Document, IBasicQualification {}

export interface QualificationSummary {
    _id: string;
    title: string;
    description: string;
    filePath: string;
    qualificationType: IQualificationType["_id"];
    approved: boolean;
}

export function mapQualificationToQualificationSummary({
    _id,
    title,
    description,
    filePath,
    qualificationType,
    approved,
}: IQualification): QualificationSummary {
    return {
        title,
        description,
        filePath,
        _id: (_id as string) || "",
        qualificationType: qualificationType as string,
        approved,
    };
}
