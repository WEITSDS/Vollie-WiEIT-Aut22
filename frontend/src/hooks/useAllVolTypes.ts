import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ResponseWithData } from "../api/utility";
import { getAllVolTypes, IVolunteerType } from "../api/volTypeAPI";

export const useAllVolTypes = (): UseQueryResult<ResponseWithData<IVolunteerType[]>, Error> => {
    return useQuery(["all-vol-types"], getAllVolTypes);
};
