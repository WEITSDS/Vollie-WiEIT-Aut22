import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ResponseWithData } from "../api/utility";
import { getVolTypeById, IVolunteerType } from "../api/volTypeAPI";

export const useVolunteerTypeById = (volTypeId: string): UseQueryResult<ResponseWithData<IVolunteerType>, Error> => {
    return useQuery([`vol-type-${volTypeId}`, volTypeId], () => getVolTypeById(volTypeId), {
        // The query will not execute until the userId exists
        enabled: !!volTypeId,
    });
};
