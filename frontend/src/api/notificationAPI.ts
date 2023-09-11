import { getDataResponse, ResponseWithData } from "./utility";
import { User } from "./userApi";
const ROOT_URL = window.location.origin;

export interface INotification {
    _id: string;
    type: string;
    content: string;
    user: string;
    userFirstName: string;
    time: string;
    userdata: User[];
}

export async function getMyNotifications(): Promise<ResponseWithData<INotification[]>> {
    return await getDataResponse(`${ROOT_URL}/api/notifications/my-notifications`);
}
