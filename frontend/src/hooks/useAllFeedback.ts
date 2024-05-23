import { useQuery, UseQueryResult } from "@tanstack/react-query";
// import { IFeedback } from "../../../backend/src/Feedback/feedback.interface";
import { getAllFeedback } from "../api/feedbackAPI";
import { IQualificationType } from "../api/qualificationTypeAPI";
import { IShift } from "../api/shiftApi";
import { User } from "../api/userApi";
import { ResponseWithData } from "../api/utility";

interface IBasicFeedback {
    user: User;
    shift: IShift;
    qualificationType: IQualificationType;
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
    formCompleted: boolean;
}

export const useAllFeedback = (): UseQueryResult<ResponseWithData<IBasicFeedback[]>, Error> => {
    return useQuery([`all`], () => getAllFeedback());
};
