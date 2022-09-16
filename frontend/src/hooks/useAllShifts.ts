import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllShifts } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";
import { IShift } from "../api/shiftApi";

export const useAllShifts = (): UseQueryResult<ResponseWithData<IShift[]>, Error> => {
    return useQuery(["all-shifts"], getAllShifts);
};
