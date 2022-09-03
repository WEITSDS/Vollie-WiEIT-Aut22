import { Tag } from "./tagApi";
import { getDataResponse, isBasicResponse, post, ResponseWithData, ResponseWithStatus } from "./utility";

const ROOT_URL = window.location.origin;

async function postAndGetBasicResponse(url: string, data: Record<string, unknown>): Promise<ResponseWithStatus> {
    let response: Response | null = null;
    try {
        response = await post(url, data);
        const resp = (await response.json()) as unknown;
        if (!isBasicResponse(resp)) {
            throw new Error("Unexpected response format");
        }
        return { ...resp, status: response.status };
    } catch (error) {
        console.error(error);
        return { success: false, message: "An unexpected error occured", status: response?.status || 500 };
    }
}

export interface ResetPasswordDetails {
    email: string;
    password: string;
}

export async function resetPassword(details: ResetPasswordDetails): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(
        `${ROOT_URL}/api/users/resetpassword`,
        details as unknown as Record<string, unknown>
    );
}

export interface LoginBody {
    email: string;
    password: string;
}

export async function loginUser(loginDetails: LoginBody): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(`${ROOT_URL}/api/login`, loginDetails as unknown as Record<string, unknown>);
}

export async function logoutUser(): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(`${ROOT_URL}/api/logout`, {});
}

interface IsSignedInResponse {
    isAdmin: boolean;
}
export function isSignedIn(): Promise<ResponseWithData<IsSignedInResponse>> {
    return getDataResponse(`${ROOT_URL}/api/issignedin`);
}

export interface NewUserBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export async function registerUser(newUser: NewUserBody): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(`${ROOT_URL}/api/users/create`, newUser as unknown as Record<string, unknown>);
}

export async function sendOTPEmail(email: string): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(`${ROOT_URL}/api/otp/send`, { email: email });
}

interface VerifyOTPBody {
    email: string;
    code: string;
}

export async function verifyOTP(data: VerifyOTPBody): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(`${ROOT_URL}/api/otp/verify`, data as unknown as Record<string, unknown>);
}
export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    verified: boolean;
    // qualifications: [];
    lastLogin: number;
    registeredAt: number;
    isAdmin: boolean;
    tags: Tag[];
}

const PATH = `${ROOT_URL}/api/users`;
export async function getAllUsers(): Promise<ResponseWithData<User[]>> {
    return getDataResponse(`${PATH}`);
}

export async function getUser(id?: string): Promise<ResponseWithData<User>> {
    return id ? getUserById(id) : getOwnUser();
}

export async function getOwnUser(): Promise<ResponseWithData<User>> {
    return getDataResponse(`${PATH}/self`);
}

export async function getUserById(id: string): Promise<ResponseWithData<User>> {
    return getDataResponse(`${PATH}/${id}`);
}

interface BatchChangeTagBody {
    userId: string;
    tagIds: string[];
}

export async function batchChangeUserTag(data: BatchChangeTagBody): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(`${PATH}/admin/batchchangetag`, data as unknown as Record<string, unknown>);
}

interface SetAdminBody {
    userId: string;
    makeAdmin: boolean;
}

export async function changeUserIsAdmin(data: SetAdminBody): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(`${PATH}/setadmin`, data as unknown as Record<string, unknown>);
}
