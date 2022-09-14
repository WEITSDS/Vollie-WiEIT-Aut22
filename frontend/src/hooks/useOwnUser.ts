import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getOwnUser, User } from "../api/userApi";
import { ResponseWithData } from "../api/utility";

export const useOwnUser = (): UseQueryResult<ResponseWithData<User>, Error> => {
    return useQuery(["own-user"], getOwnUser);
};
