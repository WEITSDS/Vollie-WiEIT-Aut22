import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMyShifts } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";
import { ShiftSummaryAdmin } from "../../../backend/src/Shift/shift.interface";

export const useMyShifts = (
    userId: string | undefined,
    shiftStatus: string
): UseQueryResult<ResponseWithData<ShiftSummaryAdmin[]>, Error> => {
    return useQuery([`my-shifts`, userId, shiftStatus], () => getMyShifts(userId, shiftStatus), {
        enabled: !!userId,
    });
};
