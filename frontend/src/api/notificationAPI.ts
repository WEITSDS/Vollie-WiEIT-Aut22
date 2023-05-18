import { getDataResponse, ResponseWithData } from "./utility";
const ROOT_URL = window.location.origin;

export interface INotification {
    _id: string;
    type: string;
    content: string;
    userFirstName: string;
    time: string;
}

export async function getMyNotifications(): Promise<ResponseWithData<INotification[]>> {
    return await getDataResponse(`${ROOT_URL}/api/notifications/my-notifications`);
}
