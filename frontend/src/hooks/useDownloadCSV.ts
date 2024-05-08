import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IFeedback } from "../../../backend/src/Feedback/feedback.interface";
import { downloadFeedbackAsCsv } from "../api/feedbackAPI";
import { ResponseWithData } from "../api/utility";

export const useDownloadCSV = (): UseQueryResult<ResponseWithData<IFeedback[]>, Error> => {
    return useQuery([`download-csv`], () => downloadFeedbackAsCsv());
};
