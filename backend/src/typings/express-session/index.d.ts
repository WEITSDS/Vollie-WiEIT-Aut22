import "express-session";

interface UserCookie {
    email: string;
    isAdmin: boolean;
}

declare module "express-session" {
    interface SessionData {
        user?: UserCookie;
    }
}
