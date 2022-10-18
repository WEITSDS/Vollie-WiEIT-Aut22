import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { UserShiftAttendaceSummary, getShiftAttendanceList } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";

export const useAttendanceList = (
    shiftId: string | undefined
): UseQueryResult<ResponseWithData<UserShiftAttendaceSummary[]>, Error> => {
    return useQuery([`attendance-list-${shiftId || ""}`, shiftId], () => getShiftAttendanceList(shiftId), {
        // The query will not execute until the userId exists
        enabled: !!shiftId,
    });
};
