import {
    deleteAndGetBasicResponse,
    getDataResponse,
    postAndGetBasicResponse,
    postAndGetDataResponse,
    ResponseWithData,
    ResponseWithStatus,
} from "./utility";

export interface NewTag {
    name: string;
    description: string;
}

export interface Tag extends NewTag {
    _id: string;
    userCount: number;
}
const PATH = `${window.location.origin}/api`;
export async function getAllTags(): Promise<ResponseWithData<Tag[]>> {
    return getDataResponse(`${PATH}/tags`);
}

export async function getTagById(tagId: string): Promise<ResponseWithData<Tag>> {
    return getDataResponse(`${PATH}/tags/${tagId}`);
}

export async function getOwnTags(): Promise<ResponseWithData<Tag[]>> {
    return getDataResponse(`${PATH}/tags/owntags`);
}

export async function createTag(newTag: NewTag): Promise<ResponseWithData<Tag>> {
    return postAndGetDataResponse(`${PATH}/tags/create`, newTag as unknown as Record<string, unknown>);
}

export async function updateTag(tag: Tag): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(`${PATH}/tags/${tag._id}/update`, tag as unknown as Record<string, unknown>);
}

export async function deleteTag(tagId: string): Promise<ResponseWithStatus> {
    return deleteAndGetBasicResponse(`${PATH}/tags/${tagId}`);
}
