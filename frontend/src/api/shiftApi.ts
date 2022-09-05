import { isBasicResponse, patch, ResponseWithStatus, post, del } from "./utility";

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

async function postBasicResponse(url: string, data: Record<string, unknown>): Promise<ResponseWithStatus> {
    let response: Response | null = null;
    try {
        response = await post(url, data);
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
}

interface AssignmentUserDetails {
    shiftid: string;
    userid: string;
}

export async function assignUserToShift(req: AssignmentUserDetails): Promise<ResponseWithStatus> {
    return patchBasicResponse(`${ROOT_URL}/api/shifts/${req.shiftid}/assign-user/${req.userid}`);
}

export async function unassignUserFromShift(req: AssignmentUserDetails): Promise<ResponseWithStatus> {
    return patchBasicResponse(`${ROOT_URL}/api/shifts/${req.shiftid}/unassign-user/${req.userid}`);
}

interface ShiftDetails {
    _id: string;
    name: string;
    startAt: Date;
    endAt: Date;
    hours: number;
    address: string;
    description: string;
}

export function createShift(req: ShiftDetails): Promise<ResponseWithStatus> {
    return postBasicResponse(`${ROOT_URL}/api/shifts/create`, { body: req });
}

interface DeleteDetails {
    _id: string;
}

export function deleteShift(req: DeleteDetails): Promise<ResponseWithStatus> {
    return deleteBasicResponse(`${ROOT_URL}/api/shifts/${req._id}`);
}
