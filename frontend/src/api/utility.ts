export async function deleteReq(url: string): Promise<Response> {
    return await fetch(url, { method: "DELETE" });
}

export async function post(url: string, body: Record<string, unknown>): Promise<Response> {
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function patch(url: string): Promise<Response> {
    return await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function get(url: string, queryParameters?: Record<string, string>): Promise<Response> {
    const queryArgs = [];
    if (queryParameters) {
        for (const k of Object.keys(queryParameters)) {
            const val = queryParameters[k];
            if (val == null) continue;
            queryArgs.push(`${k}=${val}`);
        }
    }
    return await fetch(`${url}?${queryArgs.join("&")}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function del(url: string): Promise<Response> {
    return await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export interface BasicResponse {
    message: string;
    success: boolean;
}

export function isBasicResponse(args: unknown): args is BasicResponse {
    const p = args as Partial<BasicResponse>;
    return typeof p === "object" && typeof p.message === "string" && typeof p.success === "boolean";
}

export interface ResponseWithData<T> {
    message: string;
    success: boolean;
    data?: T | null;
}

export interface BasicResponseWithData {
    message: string;
    success: boolean;
    data: unknown;
}

export function isBasicResponseWithData(args: unknown): args is BasicResponseWithData {
    const p = args as Partial<BasicResponseWithData>;
    return isBasicResponse(args) && typeof p.data != null;
}

// idk what to call this lol
export interface ResponseWithStatus extends BasicResponse {
    status: number;
}

async function processResponseAndGetBasicResponse(requestPromise: Promise<Response>): Promise<ResponseWithStatus> {
    let response: Response | null = null;
    try {
        response = await requestPromise;
        const resp = (await response.json()) as unknown;
        if (!isBasicResponse(resp)) throw new Error("Unexpected response format");
        return { ...resp, status: response.status };
    } catch (error) {
        console.error(error);
        return { success: false, message: "An unexpected error occured", status: response?.status || 500 };
    }
}

export async function postAndGetBasicResponse(url: string, data: Record<string, unknown>): Promise<ResponseWithStatus> {
    return processResponseAndGetBasicResponse(post(url, data));
}

export async function deleteAndGetBasicResponse(url: string): Promise<ResponseWithStatus> {
    return processResponseAndGetBasicResponse(deleteReq(url));
}

async function processResponseAndGetData<T>(requestPromise: Promise<Response>): Promise<ResponseWithData<T>> {
    try {
        const resp = await requestPromise;
        if (resp.status !== 200) throw new Error("An unexpected error occured");
        const body = (await resp.json()) as unknown;
        if (!isBasicResponseWithData(body)) throw new Error("Unexpected response format");
        if (!body.success) throw new Error(body.message);
        const data = body.data as T;
        return { ...body, data };
    } catch (err) {
        console.error(err);
        return { success: false, message: "An unexpected error occured", data: null };
    }
}

export async function postAndGetDataResponse<T>(
    url: string,
    data: Record<string, unknown>
): Promise<ResponseWithData<T>> {
    return processResponseAndGetData(post(url, data));
}

export async function getDataResponse<T>(
    url: string,
    queryParameters?: Record<string, string>
): Promise<ResponseWithData<T>> {
    return processResponseAndGetData(get(url, queryParameters));
}
