export interface OTPEntry {
    code: string;
    timeGenerated: number;
}

export interface OTPQuery {
    email: string;
    code: string;
}

export function isOTPQuery(args: unknown): args is OTPQuery {
    const body = args as Partial<OTPQuery>;
    return typeof body === "object" && typeof body.email === "string" && typeof body.code === "string";
}
