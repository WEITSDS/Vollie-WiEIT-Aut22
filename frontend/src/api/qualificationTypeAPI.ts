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

export interface IQualificationType {
    _id: string;
    name: string;
    description: string;
    requiresApproval: boolean;
}

const PATH = `${window.location.origin}/api`;
export async function getAllQualTypes(): Promise<ResponseWithData<IQualificationType[]>> {
    return getDataResponse(`${PATH}/qualification-types/qualification-type-all`);
}

export async function createQualificationType(
    qualificationTypeBody: object
): Promise<ResponseWithData<IQualificationType | null>> {
    try {
        const response = await post(`${PATH}/qualification-types/create`, { ...qualificationTypeBody });
        const resp = (await response.json()) as ResponseWithData<IQualificationType>;
        if (!isBasicResponse(resp)) {
            throw new Error("Unexpected response format");
        }
        return { ...resp };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error creating qualification type.", data: null };
    }
}

export async function updateQualificationType(
    qualificationTypeBody: object,
    qualificationTypeId: string
): Promise<ResponseWithData<IQualificationType | null>> {
    try {
        const response = await post(`${PATH}/qualification-types/update/${qualificationTypeId}`, {
            ...qualificationTypeBody,
        });
        const resp = (await response.json()) as ResponseWithData<IQualificationType>;
        if (!isBasicResponse(resp)) {
            throw new Error("Unexpected response format");
        }
        return { ...resp };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error updating qualification type.", data: null };
    }
}

export function deleteQualificationType(qualificationTypeId: string): Promise<ResponseWithStatus> {
    return deleteAndGetBasicResponse(`${PATH}/qualification-types/${qualificationTypeId}`);
}

export async function getQualTypeById(qualTypeId: string | undefined): Promise<ResponseWithData<IQualificationType>> {
    return typeof qualTypeId === "undefined"
        ? Promise.reject(new Error("Please pass qualTypeId"))
        : getDataResponse(`${PATH}/qualification-types/qualificationTypeById/${qualTypeId}`);
}
