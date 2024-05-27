import { Document, Types } from "mongoose";

export function isIFeedback(args: unknown): args is IFeedback {
    const p = args as Partial<IFeedback>;
    return (
        typeof p === "object" &&
        typeof p.user === "string" &&
        typeof p.qualificationType === "string" &&
        typeof p.shift === "string" &&
        typeof p.experience === "string" &&
        typeof p.learnings === "string" &&
        typeof p.teacher === "string" &&
        typeof p.studentEngagement === "string" &&
        typeof p.teacherEngagement === "string" &&
        typeof p.improvements === "string" &&
        typeof p.improvementMethods === "string" &&
        typeof p.styles === "string" &&
        typeof p.content === "string" &&
        typeof p.teamDynamics === "string" &&
        typeof p.additionalComments === "string" &&
        typeof p.rating === "string" &&
        typeof p.formCompleted === "boolean"
    );
}

export interface IBasicFeedback {
    user: Types.ObjectId;
    qualificationType: Types.ObjectId;
    shift: Types.ObjectId;
    experience?: string;
    learnings?: string;
    teacher?: string;
    studentEngagement?: string;
    teacherEngagement?: string;
    improvements?: string;
    improvementMethods?: string;
    styles?: string;
    content?: string;
    teamDynamics?: string;
    additionalComments?: string;
    rating?: string;
    formCompleted: boolean;
}

export interface IFeedback extends Document, IBasicFeedback {}
