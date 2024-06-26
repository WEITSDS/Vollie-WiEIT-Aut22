/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-catch */
// FeedbackAPI.ts
import { postAndGetBasicResponse, ResponseWithStatus, ResponseWithData, getDataResponse } from "./utility";

// The base URL of your backend server
const PATH = `https://api.wieit.xyz/api/feedback`;

// Interface for Feedback
export interface IBasicFeedback {
    user: string;
    shift: string;
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
    formCompleted?: boolean;
}

export async function getAllCompletedFeedbackByUserId(): Promise<ResponseWithData<IBasicFeedback[]>> {
    return getDataResponse(`${PATH}/all/sortedByCompletedUser`);
}

export async function addFeedback(
    user: string,
    shift: string,
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
    additionalComments?: string,
    formCompleted?: boolean
): Promise<ResponseWithStatus> {
    const payload: IBasicFeedback = {
        user,
        shift,
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
        formCompleted,
    };
    return await postAndGetBasicResponse(`${PATH}`, payload as unknown as Record<string, unknown>);
}

export async function getAllFeedback(): Promise<ResponseWithData<IBasicFeedback[]>> {
    return await getDataResponse(`${PATH}/all`);
}

export async function downloadFeedbackAsCsv(): Promise<ResponseWithData<IBasicFeedback[]>> {
    return await getDataResponse(`${PATH}/download-csv`);
}
