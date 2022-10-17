import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ResponseWithData } from "../api/utility";
import { getVolTypesForUserShift, IVolunteerType } from "../api/volTypeAPI";

export const useVoltypesForUserShift = (
    userId: string | undefined,
    shiftId: string | undefined
): UseQueryResult<ResponseWithData<IVolunteerType[]>, Error> => {
    return useQuery(
        [`user-vol-types-shift-${shiftId || ""}-${userId || ""}`, [shiftId, userId]],
        () => getVolTypesForUserShift(userId, shiftId),
        {
            // The query will not execute until the userId exists
            enabled: !!(shiftId && userId),
        }
    );
};
