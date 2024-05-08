import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IBasicFeedback, getAllCompletedFeedbackByUserId } from "../api/feedbackAPI";
import { ResponseWithData } from "../api/utility";

export const useFeedbackByUserId = (userId: string): UseQueryResult<ResponseWithData<IBasicFeedback[]>, Error> => {
    return useQuery([`user-${userId}`, userId], () => getAllCompletedFeedbackByUserId(), {
        enabled: !!userId,
    });
};
