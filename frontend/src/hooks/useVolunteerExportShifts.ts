import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { IExportData, postVolunteerExportShifts } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";

export const useVolunteerExportShifts = (): UseMutationResult<
    ResponseWithData<IExportData>,
    Error,
    { start: Date; end: Date }
> => {
    return useMutation(["volunteer-export-shifts"], (dateRange: { start: Date; end: Date }) =>
        postVolunteerExportShifts(dateRange)
    );
};
