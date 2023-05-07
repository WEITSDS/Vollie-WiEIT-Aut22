import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMyNotifications } from "../api/notificationAPI";
import { ResponseWithData } from "../api/utility";
import { INotification } from "../api/notificationAPI";

export const useMyNotifications = (userId: string | undefined): UseQueryResult<ResponseWithData<INotification[]>, Error> => {
    return useQuery([`my-notifications`, userId], () => getMyNotifications(userId), {
        enabled: !!userId,
    });
};