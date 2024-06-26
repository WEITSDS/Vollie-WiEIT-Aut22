import { getDataResponse, isBasicResponse, patch, post, ResponseWithData, ResponseWithStatus } from "./utility";
import { IVolunteerTypeUser } from "./volTypeAPI";

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
        return { success: false, message: "An unexpected error occurred", status: response?.status || 500 };
    }
}

export interface ResetPasswordDetails {
    email: string;
    password: string;
}

export async function resetPassword(details: ResetPasswordDetails): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(
        `${ROOT_URL}/api/users/reset-password`,
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
    volunteerTypes: IVolunteerTypeUser[];
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

export interface IUserShiftType {
    shift: string;
    approved: boolean;
    completed: boolean;
}
export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    verified: boolean;
    // qualifications: [];
    lastLogin: number;
    lastShift: Date;
    registeredAt: number;
    isAdmin: boolean;
    shifts: IUserShift[];
    volunteerTypes: IVolunteerTypeUser[];
}
export interface IUserShift {
    // Xiaobing shift: string;
    shift: UserShift;
    approved: boolean;
    completed: boolean;
    startAt: Date;
    endAt: Date;
    name: string;
}
// Xiaobing added
export interface UserShift {
    _id: string;
    startAt: Date;
    endAt: Date;
    name: string;
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
interface SetAdminBody {
    userId: string;
    makeAdmin: boolean;
}

export async function changeUserIsAdmin(data: SetAdminBody): Promise<ResponseWithStatus> {
    return postAndGetBasicResponse(`${PATH}/setadmin`, data as unknown as Record<string, unknown>);
}

export async function setApprovalUserVolunteerType(id: string, userId: string, status: string) {
    return patch(`${PATH}/set-volunteerType-approval/${id}/${userId}/${status}`);
}

export async function setCompleteShift(userId: string, shiftId: string, completionStatus: string) {
    return patch(`${PATH}/${userId}/set-complete-shift/${shiftId}/${completionStatus}`);
}

export async function setCompleteForm(userId: string, shiftId: string, completionStatus: string) {
    return patch(`${PATH}/${userId}/set-complete-form/${shiftId}/${completionStatus}`);
}

export async function assignVolunteerType(userId: string, volunteerTypeId: string) {
    return patch(`${PATH}/${userId}/assign-volunteer-type/${volunteerTypeId}`);
}

export async function removeVolunteerType(userId: string, volunteerTypeId: string) {
    return patch(`${PATH}/${userId}/remove-volunteer-type/${volunteerTypeId}`);
}

export async function assignCohortType(userId: string, cohortId: string) {
    return patch(`${PATH}/${userId}/assign-cohort-type/${cohortId}`);
}

export async function removeCohortType(userId: string, cohortId: string) {
    return patch(`${PATH}/${userId}/remove-cohort-type/${cohortId}`);
}
