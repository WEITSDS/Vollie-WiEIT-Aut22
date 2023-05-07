import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { IExportData, postAdminExportShifts } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";

export const useAdminExportShifts = (): UseMutationResult<
    ResponseWithData<IExportData>,
    Error,
    { start: Date; end: Date }
> => {
    return useMutation(["admin-export-shifts"], (dateRange: { start: Date; end: Date }) =>
        postAdminExportShifts(dateRange)
    );
};
