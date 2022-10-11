import { IQualificationType } from "./qualificationTypeAPI";
import {
    deleteAndGetBasicResponse,
    getDataResponse,
    patch,
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
    qualificationType: IQualificationType;
    approved: boolean;
}

export interface NewQualification {
    _id: string;
    title: string;
    description: string;
    filePath: string;
    fileId: string;
    user: string;
    qualificationType: string;
}

const PATH = `${window.location.origin}/api/qualifications`;

export async function getQualifications(id?: string): Promise<ResponseWithData<Qualification[]>> {
    return id ? getQualificationsForUserId(id) : getOwnQualifications();
}

export async function getOwnQualifications(): Promise<ResponseWithData<Qualification[]>> {
    return getDataResponse(`${PATH}/self`);
}

export async function getQualificationsForUserId(id: string | undefined): Promise<ResponseWithData<Qualification[]>> {
    return typeof id === "undefined" ? Promise.reject(new Error("Invalid id")) : getDataResponse(`${PATH}/user/${id}`);
}

export async function createQualification(
    title: string,
    description: string,
    filePath: string,
    selectedQualType: string,
    userId?: string
): Promise<ResponseWithStatus> {
    const payload: NewQualification = {
        _id: "",
        user: userId || "",
        fileId: "",
        title,
        description,
        filePath,
        qualificationType: selectedQualType,
    };
    return await postAndGetBasicResponse(`${PATH}/create`, payload as unknown as Record<string, unknown>);
}

interface QualificationPatch {
    _id: string;
    title: string;
    description: string;
    selectedQualType: string;
    user?: string;
}
export async function updateQualification({
    _id,
    title,
    description,
    user,
    selectedQualType,
}: QualificationPatch): Promise<ResponseWithStatus> {
    const payload: NewQualification = {
        _id,
        user: user || "",
        fileId: "",
        title,
        description,
        filePath: "",
        qualificationType: selectedQualType,
    };

    return postAndGetBasicResponse(`${PATH}/${_id}/update`, payload as unknown as Record<string, unknown>);
}

export async function deleteQualification(qualificationId: string): Promise<ResponseWithStatus> {
    return deleteAndGetBasicResponse(`${PATH}/${qualificationId}`);
}

export async function setApprovalUserQualification(id: string, userId: string, status: string) {
    return patch(`${PATH}/set-approval/${id}/${userId}/${status}`);
}
