import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllFeedback } from "../api/feedbackAPI";
import { IShift } from "../api/shiftApi";
import { User } from "../api/userApi";
import { ResponseWithData } from "../api/utility";

// Interface for Feedback
export interface IBasicFeedback {
    user: User;
    shift: IShift;
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
export const useAllFeedback = (): UseQueryResult<ResponseWithData<IBasicFeedback[]>, Error> => {
    return useQuery([`all`], () => getAllFeedback());
};
