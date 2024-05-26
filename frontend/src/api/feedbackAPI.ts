/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-catch */
// FeedbackAPI.ts
import { IBasicFeedback, IFeedback } from "../../../backend/src/Feedback/feedback.interface";
import { postAndGetBasicResponse, ResponseWithStatus, getDataResponse, ResponseWithData } from "./utility";
// The base URL of your backend server
const PATH = `${window.location.origin}/api/feedback`;

export async function getAllFeedback(): Promise<ResponseWithData<IFeedback[]>> {
    return await getDataResponse(`${PATH}/all`);
}

export async function downloadFeedbackAsCsv(): Promise<ResponseWithData<IFeedback[]>> {
    return await getDataResponse(`${PATH}/download-csv`);
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
