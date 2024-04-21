import { Document, Types } from "mongoose";

export function isIFeedback(args: unknown): args is IFeedback {
    const p = args as Partial<IFeedback>;
    return (
        typeof p === "object" &&
        typeof p.user === "string" &&
        typeof p.qualificationType === "string" &&
        typeof p.session === "string" &&
        typeof p.experience === "string" &&
        typeof p.learnings === "string" &&
        typeof p.teacher === "string" &&
        typeof p.studentEngagement === "string" &&
        typeof p.teacherEngagement === "string" &&
        typeof p.improvements === "string" &&
        typeof p.styles === "string" &&
        typeof p.rating === "string"
    );
}

export interface IBasicFeedback {
    user: Types.ObjectId;
    qualificationType: Types.ObjectId;
    session?: string;
    experience?: string;
    learnings?: string;
    teacher?: string;
    studentEngagement?: string;
    teacherEngagement?: string;
    improvements?: string;
    styles?: string;
    rating: string;
}

export interface IFeedback extends Document, IBasicFeedback {}
