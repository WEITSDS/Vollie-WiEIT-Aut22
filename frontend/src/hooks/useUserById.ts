import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getUserById, User } from "../api/userApi";
import { ResponseWithData } from "../api/utility";

export const useUserById = (userId: string): UseQueryResult<ResponseWithData<User>, Error> => {
    return useQuery([`user-${userId}`, userId], () => getUserById(userId));
};
