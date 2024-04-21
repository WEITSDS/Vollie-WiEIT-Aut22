/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-catch */
// FeedbackAPI.ts

import { postAndGetBasicResponse, ResponseWithStatus } from "./utility";

// The base URL of your backend server
const PATH = `${window.location.origin}/api/feedback`;

// Interface for Feedback
export interface IBasicFeedback {
    user: string;
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

export async function addFeedback(
    user: string,
    rating: string,
    session?: string,
    experience?: string,
    learnings?: string,
    teacher?: string,
    studentEngagement?: string,
    teacherEngagement?: string,
    improvements?: string,
    styles?: string
): Promise<ResponseWithStatus> {
    const payload: IBasicFeedback = {
        user,
        rating,
        session,
        experience,
        learnings,
        teacher,
        studentEngagement,
        teacherEngagement,
        improvements,
        styles,
    };
    return await postAndGetBasicResponse(`${PATH}/create`, payload as unknown as Record<string, unknown>);
}
