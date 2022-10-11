import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllQualTypes, IQualificationType } from "../api/qualificationTypeAPI";
import { ResponseWithData } from "../api/utility";
export const useAllQualTypes = (): UseQueryResult<ResponseWithData<IQualificationType[]>, Error> => {
    return useQuery(["all-qual-types"], getAllQualTypes);
};
