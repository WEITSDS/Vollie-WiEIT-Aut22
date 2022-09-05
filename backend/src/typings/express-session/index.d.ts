import "express-session";

interface UserCookie {
    _id: string;
    email: string;
    isAdmin: boolean;
}

declare module "express-session" {
    interface SessionData {
        user?: UserCookie;
    }
}
