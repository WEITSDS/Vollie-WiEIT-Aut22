import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getSearchShifts } from "../api/shiftApi";
import { ResponseWithData } from "../api/utility";
import { IShift } from "../api/shiftApi";
import { Filters } from "../components/filterResultsModal/types";

export const useSearchShifts = (filters: Filters | undefined): UseQueryResult<ResponseWithData<IShift[]>, Error> => {
    return useQuery(["search-shifts", filters], () => getSearchShifts(filters), {
        enabled: !!filters,
    });
};
