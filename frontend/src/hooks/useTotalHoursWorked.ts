import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getTotalHoursWorked } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";
import { IShift } from "../api/shiftApi";

export const useTotalHoursWorked = (userId: string | undefined): UseQueryResult<ResponseWithData<IShift[]>, Error> => {
    return useQuery([`total-user-hours`, userId], () => getTotalHoursWorked(userId), {
        enabled: !!userId,
    });
};
