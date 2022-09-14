import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AttendaceSummary, getShiftAttendanceList } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";

export const useAttendanceList = (shiftId: string): UseQueryResult<ResponseWithData<AttendaceSummary[]>, Error> => {
    return useQuery([`attendance-list-${shiftId}`, shiftId], () => getShiftAttendanceList(shiftId));
};
