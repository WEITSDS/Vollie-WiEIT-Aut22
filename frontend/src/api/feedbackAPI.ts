/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-catch */
// FeedbackAPI.ts

import { postAndGetBasicResponse, ResponseWithStatus } from "./utility";

// The base URL of your backend server
const PATH = `${window.location.origin}/api/feedback`;

// Interface for Feedback
export interface IBasicFeedback {
    user: string;
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
}

export async function addFeedback(
    user: string,
    rating: string,
    experience?: string,
    learnings?: string,
    teacher?: string,
    studentEngagement?: string,
    teacherEngagement?: string,
    improvements?: string,
    improvementMethods?: string,
    styles?: string,
    content?: string,
    teamDynamics?: string,
    additionalComments?: string
): Promise<ResponseWithStatus> {
    const payload: IBasicFeedback = {
        user,
        rating,
        experience,
        learnings,
        teacher,
        studentEngagement,
        teacherEngagement,
        improvements,
        improvementMethods,
        styles,
        content,
        teamDynamics,
        additionalComments,
    };
    return await postAndGetBasicResponse(`${PATH}`, payload as unknown as Record<string, unknown>);
}
