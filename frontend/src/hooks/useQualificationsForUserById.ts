import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getQualificationsForUserId, Qualification } from "../api/qualificationAPI";
import { ResponseWithData } from "../api/utility";

export const useQualificationsForUserById = (
    userId: string | undefined
): UseQueryResult<ResponseWithData<Qualification[]>, Error> => {
    return useQuery([`user-qualifications-${userId || ""}`, userId], () => getQualificationsForUserId(userId), {
        // The query will not execute until the userId exists
        enabled: !!userId,
    });
};
