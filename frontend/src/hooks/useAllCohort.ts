import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ResponseWithData } from "../api/utility";
import { getAllCohorts, ICohort } from "../api/cohortTypeAPI";

export const useAllCohort = (): UseQueryResult<ResponseWithData<ICohort[]>, Error> => {
    return useQuery(["all-cohorts"], getAllCohorts);
};
