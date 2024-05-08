import { IFeedback } from "../../../backend/src/Feedback/feedback.interface";
import { getDataResponse, ResponseWithData } from "./utility";
const ROOT_URL = window.location.origin;

export async function getAllFeedback(): Promise<ResponseWithData<IFeedback[]>> {
    return await getDataResponse(`${ROOT_URL}/api/feedbacks/all`);
}

export async function downloadFeedbackAsCsv(): Promise<ResponseWithData<IFeedback[]>> {
    return await getDataResponse(`${ROOT_URL}/api/feedbacks/download-csv`);
}
