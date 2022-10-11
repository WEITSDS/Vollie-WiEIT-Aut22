import {
    // deleteAndGetBasicResponse,
    getDataResponse,
    // postAndGetBasicResponse,
    ResponseWithData,
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
    return getDataResponse(`${PATH}/volunteer-types/qualification-type-all`);
}
