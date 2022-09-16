import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMyShifts } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";
import { IShift } from "../api/shiftApi";

export const useMyShifts = (userId: string | undefined): UseQueryResult<ResponseWithData<IShift[]>, Error> => {
    return useQuery([`my-shifts`, userId], () => getMyShifts(userId), {
        enabled: !!userId,
    });
};
