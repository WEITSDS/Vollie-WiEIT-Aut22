import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IFeedback } from "../../../backend/src/Feedback/feedback.interface";
import { getAllFeedback } from "../api/feedbackAPI";
import { ResponseWithData } from "../api/utility";

export const useAllFeedback = (): UseQueryResult<ResponseWithData<IFeedback[]>, Error> => {
    return useQuery([`all`], () => getAllFeedback());
};
