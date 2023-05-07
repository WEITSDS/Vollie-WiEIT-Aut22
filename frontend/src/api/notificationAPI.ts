//import { Filters } from "../components/filterResultsModal/types";
import {
    //isBasicResponse,
    // patch,
    //ResponseWithStatus,
    //post,
    //del,
    getDataResponse,
    ResponseWithData,
    //postAndGetDataResponse,
} from "./utility";
const ROOT_URL = window.location.origin;

/*async function patchBasicResponse(url: string): Promise<ResponseWithStatus> {
    let response: Response | null = null;
    try {
        response = await patch(url);
        const resp = (await response.json()) as unknown;
        if (!isBasicResponse(resp)) {
            throw new Error("Unexpected response format");
        }
        return { ...resp, status: response.status };
    } catch (error) {
        console.error(error);
        return { success: false, message: "An unexpected error occured", status: response?.status || 500 };
    }
}

async function deleteBasicResponse(url: string): Promise<ResponseWithStatus> {
    let response: Response | null = null;
    try {
        response = await del(url);
        const resp = (await response.json()) as unknown;
        if (!isBasicResponse(resp)) {
            throw new Error("Unexpected response format");
        }
        return { ...resp, status: response.status };
    } catch (error) {
        console.error(error);
        return { success: false, message: "An unexpected error occured", status: response?.status || 500 };
    }
}*/

export interface INotification {
    content: string;
    user: string;
    time: Date;
}

export async function getMyNotifications(userId: string | undefined): Promise<ResponseWithData<INotification[]>> {
    return typeof userId === "undefined"
        ? Promise.reject(new Error("Invalid id"))
        : await getDataResponse(`${ROOT_URL}/api/notifications/self/${userId}`);
}