import { getDataResponse, ResponseWithData } from "./utility";

const ROOT_URL = "https://api.wieit.xyz";

export interface INotification {
    _id: string;
    type: string;
    content: string;
    user: string;
    userFirstName: string;
    time: string;
    action: string;
    typeId: string; //typeshiftid
    userVolType: string; //uniqueShiftid
}

export async function getMyNotifications(): Promise<ResponseWithData<INotification[]>> {
    return await getDataResponse(`${ROOT_URL}/api/notifications/my-notifications`);
}

export async function getAllNotifications(): Promise<ResponseWithData<INotification[]>> {
    return await getDataResponse(`${ROOT_URL}/api/notifications/get-batch-notifications`);
}

export async function updateNotificationStatus(
    notificationId: string,
    action: string
): Promise<ResponseWithData<void>> {
    try {
        const res = await fetch(`${ROOT_URL}/api/notifications/update-notification-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ notificationId, action }),
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await res.json(); // Assuming this can provide you the message, if any
        if (res.ok) {
            return { success: true, message: "Notification status updated successfully", data: undefined };
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            return { success: false, message: data.message, data: undefined };
        }
    } catch (error) {
        console.error("Failed to update notification status", error);
        return { success: false, message: "Could not update notification status", data: undefined };
    }
}
