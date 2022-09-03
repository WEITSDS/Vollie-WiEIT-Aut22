import { Document } from "mongoose";

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
    user: string;
}

export interface IQualification extends Document, IBasicQualification {}

export interface QualificationSummary {
    _id: string;
    title: string;
    description: string;
    filePath: string;
}

export function mapQualificationToQualificationSummary({
    _id,
    title,
    description,
    filePath,
}: IQualification): QualificationSummary {
    return { title, description, filePath, _id: (_id as string) || "" };
}
