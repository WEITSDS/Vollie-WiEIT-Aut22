import { isBasicResponse, patch, ResponseWithStatus } from "./utility";

const ROOT_URL = window.location.origin;

async function patchBasicResponse(url: string): Promise<ResponseWithStatus> {
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

interface ShiftDetails {
    id: string;
    name: string;
    startAt: string;
    endAt: string;
    address: string;
    description: string;
    status: string;
    hours: number;
}

export async function assignUserToShift(shift: ShiftDetails): Promise<ResponseWithStatus> {
    return patchBasicResponse(`${ROOT_URL}/api/shifts/assign-user/${shift.id}`);
}
