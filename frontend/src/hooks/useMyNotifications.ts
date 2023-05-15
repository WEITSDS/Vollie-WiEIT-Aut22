import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMyNotifications } from "../api/notificationAPI";
import { ResponseWithData } from "../api/utility";
import { INotification } from "../api/notificationAPI";

export const useMyNotifications = (): UseQueryResult<ResponseWithData<INotification[]>, Error> => {
    return useQuery([`my-notifications`], () => getMyNotifications());
};
