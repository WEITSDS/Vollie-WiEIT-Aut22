import { Filters } from "../components/filterResultsModal/types";
import {
    isBasicResponse,
    patch,
    ResponseWithStatus,
    post,
    del,
    getDataResponse,
    ResponseWithData,
    postAndGetDataResponse,
} from "./utility";

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
        return { success: false, message: "An unexpected error occurred", status: response?.status || 500 };
    }
}

// async function postBasicResponse(url: string, data: Record<string, unknown>): Promise<ResponseWithStatus> {
//     let response: Response | null = null;
//     try {
//         response = await post(url, data);
//         const resp = (await response.json()) as unknown;
//         if (!isBasicResponse(resp)) {
//             throw new Error("Unexpected response format");
//         }
//         return { ...resp, status: response.status };
//     } catch (error) {
//         console.error(error);
//         return { success: false, message: "An unexpected error occurred", status: response?.status || 500 };
//     }
// }

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
        return { success: false, message: "An unexpected error occurred", status: response?.status || 500 };
    }
}

interface AssignmentUserDetails {
    shiftId: string;
    userId: string;
    selectedVolType: string;
}

interface UnAssignmentUserDetails {
    shiftId: string;
    userId: string;
}

export async function assignUserToShift(req: AssignmentUserDetails): Promise<ResponseWithStatus> {
    return patchBasicResponse(`${ROOT_URL}/api/shifts/${req.shiftId}/assign-user/${req.userId}/${req.selectedVolType}`);
}

export async function unassignUserFromShift(req: UnAssignmentUserDetails): Promise<ResponseWithStatus> {
    return patchBasicResponse(`${ROOT_URL}/api/shifts/${req.shiftId}/unassign-user/${req.userId}`);
}

// export interface IShift extends Document {
//     _id: string;
//     name: string;
//     startAt: string;
//     endAt: string;
//     venue: string;
//     address: string;
//     description: string;
//     hours: number;
//     notes: string;
//     users: Array<string>;
//     category: "School Outreach" | "Event" | "Committee" | "Other";
//     requiresWWCC: boolean;
//     numGeneralVolunteers: number;
//     numUndergradAmbassadors: number;
//     numPostgradAmbassadors: number;
//     numStaffAmbassadors: number;
//     numSprouts: number;
// }

export interface IShift {
    _id: string;
    name: string;
    startAt: Date;
    endAt: Date;
    venue: string;
    address: string;
    description: string;
    hours: number;
    // notes: string;
    users: Array<IShiftUser>;
    category: "School Outreach" | "Event" | "Committee" | "Other";
    requiredQualifications: Array<IShiftRequiredQualification>;
    volunteerTypeAllocations: Array<IShiftVolunteerAllocations>;
    isUnreleased: boolean;
}

export interface IReport {
    firstName: string;
    lastName: string;
    position: string;
    total: number;
}

export interface IExportData {
    csv: string;
}

export interface IShiftRequiredQualification {
    qualificationType: string; // Qualification type ID
    numRequired: number;
    currentNum: number;
}

export interface IShiftVolunteerAllocations {
    type: string; // Volunteer type ID
    numMembers: number;
    currentNum: number;
}

export interface IShiftUser {
    user: string; // userID
    chosenVolunteerType: string; // volunteerTypeID
    approved: boolean;
}

export async function createShift(shiftBody: object): Promise<ResponseWithData<IShift | null>> {
    try {
        const response = await post(`${ROOT_URL}/api/shifts/create`, { ...shiftBody });
        const resp = (await response.json()) as ResponseWithData<IShift>;
        if (!isBasicResponse(resp)) {
            throw new Error("Unexpected response format");
        }
        return { ...resp };
    } catch (error) {
        console.error(error);
        return { success: false, message: "An unexpected error occurred", data: null };
    }
}

export async function updateShift(shiftBody: object, shiftId: string): Promise<ResponseWithData<IShift | null>> {
    try {
        const response = await post(`${ROOT_URL}/api/shifts/update/${shiftId}`, { ...shiftBody });
        const resp = (await response.json()) as ResponseWithData<IShift>;
        if (!isBasicResponse(resp)) {
            throw new Error("Unexpected response format");
        }
        return { ...resp };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error updating shift information", data: null };
    }
}

interface DeleteDetails {
    _id: string;
}

export function deleteShift(req: DeleteDetails): Promise<ResponseWithStatus> {
    return deleteBasicResponse(`${ROOT_URL}/api/shifts/${req._id}`);
}

// export async function getSearchShifts(filters: Filters | undefined): Promise<ResponseWithData<IShift[]>> {
//     return typeof filters === "undefined"
//         ? Promise.reject(new Error("Invalid id"))
//         : await postAndGetDataResponse(`${ROOT_URL}/api/shifts/get-search-shifts`, {
//               filters,
//           });
// }

export async function getSearchShifts(filters: Filters | undefined): Promise<ResponseWithData<IShift[]>> {
    const effectiveFilters = filters ?? {};
    return await postAndGetDataResponse(`${ROOT_URL}/api/shifts/get-search-shifts`, {
        filters: effectiveFilters,
    });
}

export async function postAdminExportShifts(dateRange: {
    start: Date;
    end: Date;
}): Promise<ResponseWithData<IExportData>> {
    return typeof dateRange === "undefined"
        ? Promise.reject(new Error("Invalid id"))
        : await postAndGetDataResponse(`${ROOT_URL}/api/shifts/admin-export-shifts`, {
              dateRange,
          });
}

export async function postVolunteerExportShifts(dateRange: {
    start: Date;
    end: Date;
}): Promise<ResponseWithData<IExportData>> {
    return typeof dateRange === "undefined"
        ? Promise.reject(new Error("Invalid id"))
        : await postAndGetDataResponse(`${ROOT_URL}/api/shifts/volunteer-export-shifts`, {
              dateRange,
          });
}

// being explicit with undefined check for userId, for why, see type safety with enabled
// https://tkdodo.eu/blog/react-query-and-type-script
export async function getMyShifts(userId: string | undefined): Promise<ResponseWithData<IShift[]>> {
    return typeof userId === "undefined"
        ? Promise.reject(new Error("Invalid id"))
        : await getDataResponse(`${ROOT_URL}/api/shifts/get-user-shifts/${userId}`);
}

export async function getTotalHoursWorked(userId: string | undefined): Promise<ResponseWithData<IShift[]>> {
    return typeof userId === "undefined"
        ? Promise.reject(new Error("Invalid id"))
        : await getDataResponse(`${ROOT_URL}/api/shifts/total-user-hours/${userId}`);
}

export async function getShiftById(shiftId: string): Promise<ResponseWithData<IShift>> {
    return await getDataResponse(`${ROOT_URL}/api/shifts/shift/${shiftId}`);
}

export interface UserShiftAttendanceSummary {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    volTypeName: string;
    volTypeId: string;
    approved: boolean;
    completed: boolean;
}

export async function getShiftAttendanceList(
    shiftId: string | undefined
): Promise<ResponseWithData<UserShiftAttendanceSummary[]>> {
    return typeof shiftId === "undefined"
        ? Promise.reject(new Error("Invalid id"))
        : await getDataResponse(`${ROOT_URL}/api/shifts/attendance-list/${shiftId}`);
}

export async function setApprovalUserForShift(
    userId: string,
    shiftId: string,
    approvalStatus: string
): Promise<ResponseWithStatus> {
    return await patchBasicResponse(`${ROOT_URL}/api/shifts/${shiftId}/approve-user/${userId}/${approvalStatus}`);
}
// Utility function to POST data and get the response
async function postDataResponse<T>(url: string, body: any): Promise<ResponseWithData<T>> {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await response.json();
    } catch (error) {
        return {
            success: false,
            data: null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            message: (error as Error).message,
        };
    }
}

// Fetch volunteer report
export async function getVolunteerReport(
    volunteerPositions: string[],
    startDate: string,
    endDate: string
): Promise<ResponseWithData<IReport[]>> {
    return await postDataResponse(`${ROOT_URL}/api/shifts/get-volunteer-report`, {
        volunteerPositions,
        startDate,
        endDate,
    });
}

// Export volunteer report as Excel
export async function exportVolunteerReportAsExcel(
    volunteerPositions: string[],
    startDate: string,
    endDate: string
): Promise<Blob | null> {
    try {
        const response = await fetch(`${ROOT_URL}/api/shift.export-report-excel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                volunteerPositions,
                startDate,
                endDate,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate Excel report");
        }

        return await response.blob();
    } catch (error) {
        console.error("Error exporting report:", error);
        return null;
    }
}
