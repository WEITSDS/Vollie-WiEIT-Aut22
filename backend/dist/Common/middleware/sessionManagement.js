"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = exports.endSession = exports.useSessionManagement = void 0;
var tslib_1 = require("tslib");
var express_session_1 = tslib_1.__importDefault(require("express-session"));
var constants_1 = require("../../constants");
function useSessionManagement(application) {
    application.use((0, express_session_1.default)({
        secret: constants_1.COOKIE_SECRET,
        cookie: { maxAge: constants_1.COOKIE_DURATION },
        resave: false,
        saveUninitialized: true,
        rolling: true,
    }));
    application.use(isCurrentUserLoggedIn);
}
exports.useSessionManagement = useSessionManagement;
var routesThatDontNeedAuth = ["/api/login", "api/users/create", "api/otp/verify", "api/otp/send"];
function routeNeedsAuth(url) {
    var e_1, _a;
    try {
        for (var routesThatDontNeedAuth_1 = tslib_1.__values(routesThatDontNeedAuth), routesThatDontNeedAuth_1_1 = routesThatDontNeedAuth_1.next(); !routesThatDontNeedAuth_1_1.done; routesThatDontNeedAuth_1_1 = routesThatDontNeedAuth_1.next()) {
            var route = routesThatDontNeedAuth_1_1.value;
            if (url.indexOf(route) !== -1) {
                return false;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (routesThatDontNeedAuth_1_1 && !routesThatDontNeedAuth_1_1.done && (_a = routesThatDontNeedAuth_1.return)) _a.call(routesThatDontNeedAuth_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return true;
}
function isCurrentUserLoggedIn(req, res, next) {
    var notLoggedIn = req.session.user == null;
    if (notLoggedIn && routeNeedsAuth(req.url)) {
        res.status(401).json({ message: "Unauthorized, please login", success: false });
    }
    else {
        next();
    }
}

function endSession(req, res) {
    req.session.destroy(function () { return res.status(200).json({ success: true, message: "Logged out successfully" }); });
}
exports.endSession = endSession;
function createSession(req, user) {
    req.session.user = user;
}
exports.createSession = createSession;
//# sourceMappingURL=sessionManagement.js.map