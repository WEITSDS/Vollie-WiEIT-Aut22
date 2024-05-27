import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ResponseWithData } from "../api/utility";
import { getCohortsForUser, ICohort } from "../api/cohortTypeAPI";

export const useCohortsForUser = (userId: string | undefined): UseQueryResult<ResponseWithData<ICohort[]>, Error> => {
    return useQuery([`cohortById-${userId || ""}`, userId], () => getCohortsForUser(userId), {
        // The query will not execute until the userId exists
        enabled: !!userId,
    });
};
