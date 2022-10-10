import {
    // deleteAndGetBasicResponse,
    getDataResponse,
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
