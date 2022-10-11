import {
    // deleteAndGetBasicResponse,
    getDataResponse,
    isBasicResponse,
    post,
    // postAndGetBasicResponse,
    ResponseWithData,
    // ResponseWithStatus,
} from "./utility";

export interface IVolunteerType {
    _id: string;
    name: string;
    description: string;
    requiresApproval: boolean;
}

export interface IVolunteerTypeUser {
    type: string;
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
