import {
    deleteAndGetBasicResponse,
    // deleteAndGetBasicResponse,
    getDataResponse,
    isBasicResponse,
    post,
    // postAndGetBasicResponse,
    ResponseWithData,
    ResponseWithStatus,
    // ResponseWithStatus,
} from "./utility";

export interface IVolunteerType {
    _id: string;
    name: string;
    description: string;
    requiresApproval: boolean;
    typeId: string;
}

export interface IVolunteerTypeUser {
    type: string;
    approved: boolean;
}

// The volunteer type with the approval status
export interface IVolunteerTypeUserWithApproved {
    _id: string; // id of the volunteer type
    name: string;
    approved: boolean;
}

const PATH = `${window.location.origin}/api`;
export async function getAllVolTypes(): Promise<ResponseWithData<IVolunteerType[]>> {
    return getDataResponse(`${PATH}/volunteer-types/volunteer-type-all`);
}

export async function createVolunteerType(volunteerTypeBody: object): Promise<ResponseWithData<IVolunteerType | null>> {
    try {
        const response = await post(`${PATH}/volunteer-types/create`, { ...volunteerTypeBody });
        const resp = (await response.json()) as ResponseWithData<IVolunteerType>;
        if (!isBasicResponse(resp)) {
            throw new Error("Unexpected response format");
        }
        return { ...resp };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error creating qualification type.", data: null };
    }
}

export async function updateVolunteerType(
    volunteerTypeBody: object,
    volunteerTypeId: string
): Promise<ResponseWithData<IVolunteerType | null>> {
    try {
        const response = await post(`${PATH}/volunteer-types/update/${volunteerTypeId}`, {
            ...volunteerTypeBody,
        });
        const resp = (await response.json()) as ResponseWithData<IVolunteerType>;
        if (!isBasicResponse(resp)) {
            throw new Error("Unexpected response format");
        }
        return { ...resp };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error updating qualification type.", data: null };
    }
}

export function deleteVolunteerType(volunteerTypeId: string): Promise<ResponseWithStatus> {
    return deleteAndGetBasicResponse(`${PATH}/volunteer-types/${volunteerTypeId}`);
}

export async function getVolTypesForUser(
    userId: string | undefined
): Promise<ResponseWithData<IVolunteerTypeUserWithApproved[]>> {
    return typeof userId === "undefined"
        ? Promise.reject(new Error("Invalid id"))
        : getDataResponse(`${PATH}/volunteer-types/volunteer-types-user/${userId}`);
}

export async function getVolTypesForUserShift(
    userId: string | undefined,
    shiftId: string | undefined
): Promise<ResponseWithData<IVolunteerType[]>> {
    return typeof userId === "undefined" || typeof shiftId === "undefined"
        ? Promise.reject(new Error("Please pass both userId and shiftId"))
        : getDataResponse(`${PATH}/shifts/available-roles-for-shift-user/${userId}/${shiftId}`);
}

export async function getVolTypeById(volTypeId: string | undefined): Promise<ResponseWithData<IVolunteerType>> {
    return typeof volTypeId === "undefined"
        ? Promise.reject(new Error("Please pass volTypeId"))
        : getDataResponse(`${PATH}/volunteer-types/volunteerTypeById/${volTypeId}`);
}
