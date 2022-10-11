import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getShiftById } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";
import { IShift } from "../api/shiftApi";

export const useShiftById = (shiftId: string): UseQueryResult<ResponseWithData<IShift>, Error> => {
    return useQuery([`shift-${shiftId}`, shiftId], () => getShiftById(shiftId), {
        // The query will not execute until the userId exists
        enabled: !!shiftId,
    });
};
