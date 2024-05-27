import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IBasicFeedback, getAllCompletedFeedbackByUserId } from "../api/feedbackAPI";
import { ResponseWithData } from "../api/utility";

export const useFeedbackByUserId = (): UseQueryResult<ResponseWithData<IBasicFeedback[]>, Error> => {
    return useQuery([`my-feedback`], () => getAllCompletedFeedbackByUserId());
};
