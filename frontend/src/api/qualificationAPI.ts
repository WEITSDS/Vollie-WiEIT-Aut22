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
    user: string;
    wwccNumber: string;
    expiryDate: string;
    dateOfbirth: string;
    fullName: string;
}

export interface NewQualification {
    _id: string;
    title: string;
    wWCC: string;
    user: string;
    expiryDate: string;
    birthDate: string;
}

export interface CreateQualification {
    user: string;
    wwccNumber: string;
    expiryDate: string;
    dateOfbirth: string;
    fullName: string;
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
    user: string,
    wwccNumber: string,
    expiryDate: string,
    dateOfbirth: string,
    fullName: string
): Promise<ResponseWithStatus> {
    const payload: CreateQualification = {
        user,
        wwccNumber,
        expiryDate,
        dateOfbirth,
        fullName,
    };
    return await postAndGetBasicResponse(`${PATH}/create`, payload as unknown as Record<string, unknown>);
}

interface QualificationPatch {
    _id: string;
    title: string;
    wWCC: string;
    expiryDate: string;
    birthDate: string;
    user?: string;
}
export async function updateQualification({
    _id,
    title,
    wWCC,
    user,
    expiryDate,
    birthDate,
}: QualificationPatch): Promise<ResponseWithStatus> {
    const payload: NewQualification = {
        _id,
        user: user || "",
        title,
        wWCC,
        expiryDate,
        birthDate,
    };

    return postAndGetBasicResponse(`${PATH}/${_id}/update`, payload as unknown as Record<string, unknown>);
}

export async function deleteQualification(qualificationId: string): Promise<ResponseWithStatus> {
    return deleteAndGetBasicResponse(`${PATH}/${qualificationId}`);
}

export async function setApprovalUserQualification(id: string, userId: string, status: string) {
    return patch(`${PATH}/set-approval/${id}/${userId}/${status}`);
}
