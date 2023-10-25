import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllNotifications } from "../api/notificationAPI";
import { ResponseWithData } from "../api/utility";
import { INotification } from "../api/notificationAPI";

export const useAllNotifications = (): UseQueryResult<ResponseWithData<INotification[]>, Error> => {
    return useQuery([`get-batch-notifications`], () => getAllNotifications());
};
