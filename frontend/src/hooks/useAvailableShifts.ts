import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAvailableShifts } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";
import { ShiftSummaryAdmin } from "../../../backend/src/Shift/shift.interface";

export const useAvailableShifts = (): UseQueryResult<ResponseWithData<ShiftSummaryAdmin[]>, Error> => {
    return useQuery(["available-shifts"], getAvailableShifts);
};
