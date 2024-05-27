import { getDataResponse, postAndGetBasicResponse, ResponseWithData, ResponseWithStatus } from "./utility";

export interface Image {
    _id: string;
    filePath: string;
    fileId: string;
    user: string;
}

export interface NewImage {
    _id: string;
    filePath: string;
    fileId: string;
    user: string;
}

const PATH = `${window.location.origin}/api/profileimage`;

//export async function getImage(id?: string): Promise<ResponseWithData<Image[]>> {
//return id ? getImagesForUserId(id) : getOwnImages();
//}

export async function getImages(): Promise<ResponseWithData<Image[]>> {
    return getDataResponse(`${PATH}/self`);
}

export async function getImagesForUserId(id: string | undefined): Promise<ResponseWithData<Image[]>> {
    return typeof id === "undefined" ? Promise.reject(new Error("Invalid id")) : getDataResponse(`${PATH}/user/${id}`);
}

export async function createImage(filePath: string, userId?: string): Promise<ResponseWithStatus> {
    const payload: NewImage = {
        _id: "",
        user: userId || "",
        fileId: "",
        filePath,
    };
    return await postAndGetBasicResponse(`${PATH}/create`, payload as unknown as Record<string, unknown>);
}

interface QualificationPatch {
    _id: string;
    user?: string;
}
export async function updateImage({ _id, user }: QualificationPatch): Promise<ResponseWithStatus> {
    const payload: NewImage = {
        _id,
        user: user || "",
        fileId: "",
        filePath: "",
    };

    return postAndGetBasicResponse(`${PATH}/${_id}/update`, payload as unknown as Record<string, unknown>);
}
