import { Document, Types } from "mongoose";

export function isIFeedback(args: unknown): args is IFeedback {
    const p = args as Partial<IFeedback>;
    return (
        typeof p === "object" &&
        typeof p.user === "string" &&
        typeof p.qualificationType === "string" &&
        typeof p.session === "string" &&
        typeof p.experience === "string" &&
        typeof p.keyLearnings === "string" &&
        typeof p.learnings === "string" &&
        typeof p.teacher === "string" &&
        typeof p.studentEngagement === "string" &&
        typeof p.teacherEngagement === "string" &&
        typeof p.improvements === "string" &&
        typeof p.sessionImprovements === "string" &&
        typeof p.styles === "string" &&
        typeof p.contentDelivery === "string" &&
        typeof p.teamDynamics === "string" &&
        typeof p.rating === "string"
    );
}

export interface IBasicFeedback {
    user: Types.ObjectId;
    qualificationType: Types.ObjectId;
    session?: string;
    experience?: string;
    learnings?: string;
    keyLearnings?: string;
    teacher?: string;
    studentEngagement?: string;
    teacherEngagement?: string;
    improvements?: string;
    sessionImprovements?: string;
    styles?: string;
    contentDelivery?: string;
    teamDynamics?: string;
    rating: string;
}

export interface IFeedback extends Document, IBasicFeedback {}
