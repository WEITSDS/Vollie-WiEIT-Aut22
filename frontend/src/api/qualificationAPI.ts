import {
    deleteAndGetBasicResponse,
    getDataResponse,
    postAndGetBasicResponse,
    ResponseWithData,
    ResponseWithStatus,
} from "./utility";

export interface Qualification {
    _id: string;
    title: string;
    description: string;
    filePath: string;
    fileId: string;
    user: string;
}

const PATH = `${window.location.origin}/api/qualifications`;

export async function getQualifications(id?: string): Promise<ResponseWithData<Qualification[]>> {
    return id ? getQualificationsForUserId(id) : getOwnQualifications();
}

export async function getOwnQualifications(): Promise<ResponseWithData<Qualification[]>> {
    return getDataResponse(`${PATH}/self`);
}

export async function getQualificationsForUserId(id: string): Promise<ResponseWithData<Qualification[]>> {
    return getDataResponse(`${PATH}/user/${id}`);
}

export async function createQualification(
    title: string,
    description: string,
    filePath: string,
    userId?: string
): Promise<ResponseWithStatus> {
    const payload: Qualification = { _id: "", user: userId || "", fileId: "", title, description, filePath };
    return await postAndGetBasicResponse(`${PATH}/create`, payload as unknown as Record<string, unknown>);
}

interface QualificationPatch {
    _id: string;
    title: string;
    description: string;
    user?: string;
}
export async function updateQualification({
    _id,
    title,
    description,
    user,
}: QualificationPatch): Promise<ResponseWithStatus> {
    const payload: Qualification = { _id, user: user || "", fileId: "", title, description, filePath: "" };

    return postAndGetBasicResponse(`${PATH}/${_id}/update`, payload as unknown as Record<string, unknown>);
}

export async function deleteQualification(qualificationId: string): Promise<ResponseWithStatus> {
    return deleteAndGetBasicResponse(`${PATH}/${qualificationId}`);
}
