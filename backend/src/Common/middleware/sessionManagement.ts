import session from "express-session"; //ADD EVERYTHING BELOW BACK IN
import { COOKIE_DURATION, COOKIE_SECRET } from "../../constants";
import * as core from "express-serve-static-core";
import { UserCookie } from "../../typings/express-session";
// import { Logger } from "tslog";

// const logger = new Logger({ name: "authmanager" });

/** Adds session management middleware with the appropriate configurations */
export function useSessionManagement(application: core.Express): void {
    application.use(
        session({
            secret: COOKIE_SECRET, // just secret stuff idk
            cookie: { maxAge: COOKIE_DURATION }, // how long a cookie can last before it expires
            resave: false, // whether or not cookies are saved even if they havent changed
            saveUninitialized: true, // saves new and unmodified cookies bc why not
            rolling: true, // refreshes the session as needed as it nears expiry
            // TODO: need to setup soem sort of store,
            // probably one linked to mongodb as default MemoryStore cannot be used for prod
            // store: INSERT_SOME_STORE_HERE
        })
    );
    // Most endpoints need a is-logged-in guard, so add middleware at the app level
    // and whitelist endpoints as needed
    application.use(isCurrentUserLoggedIn);
}

// Being extra explicit by adding the "/api" bit to the start just in case :)
const routesThatDontNeedAuth = [
    "/api/login",
    "api/users/create",
    "api/otp/verify",
    "api/otp/send",
    "api/volunteer-types/volunteer-type-all",
];

function routeNeedsAuth(url: string): boolean {
    // If any of the route components that don't need auth form part of the url, the route does
    // not need authentication (return false) - no matches found means it does
    for (const route of routesThatDontNeedAuth) {
        if (url.indexOf(route) !== -1) {
            return false;
        }
    }
    return true;
}

/** Checks if the requesting user is logged in and what page they're on, and lets them continue or responds with 401 */
function isCurrentUserLoggedIn(req: core.Request, res: core.Response, next: core.NextFunction): void {
    // if there's no user object and we're not requesting something that doesn't need auth,
    // reponse with 401 unauthorised (identity not known) otherwise continue with the flow of middleware
    const notLoggedIn = req.session.user == null;
    if (notLoggedIn && routeNeedsAuth(req.url)) {
        res.status(401).json({ message: "Unauthorised, please login", success: false });
    } else {
        next();
    }
}

/** Ends the current user's session. */
export function endSession(req: core.Request, res: core.Response): void {
    req.session.destroy(() => res.status(200).json({ success: true, message: "Logged out successfully" }));
}

/** Creates a session for the current user and adds a 'user' object with details we'll use for security checks later */
export function createSession(req: core.Request, user: UserCookie): void {
    req.session.user = user;
}
