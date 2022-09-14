import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getShiftById } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";
import { ShiftSummaryAdmin } from "../../../backend/src/Shift/shift.interface";

export const useShiftById = (shiftId: string): UseQueryResult<ResponseWithData<ShiftSummaryAdmin>, Error> => {
    return useQuery([`shift-${shiftId}`, shiftId], () => getShiftById(shiftId));
};
