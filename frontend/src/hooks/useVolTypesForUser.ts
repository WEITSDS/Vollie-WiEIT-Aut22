import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ResponseWithData } from "../api/utility";
import { getVolTypesForUser, IVolunteerTypeUserWithApproved } from "../api/volTypeAPI";

export const useVoltypesForUser = (
    userId: string | undefined
): UseQueryResult<ResponseWithData<IVolunteerTypeUserWithApproved[]>, Error> => {
    return useQuery([`user-vol-types-${userId || ""}`, userId], () => getVolTypesForUser(userId), {
        // The query will not execute until the userId exists
        enabled: !!userId,
    });
};
