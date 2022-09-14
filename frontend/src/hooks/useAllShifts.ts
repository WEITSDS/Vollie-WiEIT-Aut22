import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllShifts } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";
import { ShiftSummaryAdmin } from "../../../backend/src/Shift/shift.interface";

export const useAllShifts = (): UseQueryResult<ResponseWithData<ShiftSummaryAdmin[]>, Error> => {
    return useQuery(["all-shifts"], getAllShifts);
};
