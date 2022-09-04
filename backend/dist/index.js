"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var constants_1 = require("./constants");
var mongoose_1 = tslib_1.__importDefault(require("mongoose"));
var user_route_1 = tslib_1.__importDefault(require("./User/user.route"));
var shift_route_1 = tslib_1.__importDefault(require("./Shift/shift.route"));
var user_admin_route_1 = tslib_1.__importDefault(require("./User/user.admin.route"));
var qualifications_route_1 = tslib_1.__importDefault(require("./Qualifications/qualifications.route"));
var tag_route_1 = tslib_1.__importDefault(require("./Tag/tag.route"));
var https = require("https");
var cors_1 = tslib_1.__importDefault(require("cors"));
var otp_route_1 = tslib_1.__importDefault(require("./otps/otp.route"));
var sessionManager = tslib_1.__importStar(require("./Common/middleware/sessionManagement"));
var constants_2 = require("./constants");
var tslog_1 = require("tslog");
var user_controller_1 = require("./User/user.controller");
var utility_1 = require("./utility");
var logger = new tslog_1.Logger({ name: "index" });
var app = (0, express_1.default)();
app.listen(constants_1.PORT);
logger.info("Server started at ".concat(constants_1.PROTOCOL, "://").concat(constants_1.HOST, ":").concat(constants_1.PORT));
mongoose_1.default
    .connect(constants_2.config.mongo.url, constants_2.config.mongo.options)
    .then(function (_result) {
    logger.info("Connected to MongoDB at ".concat(constants_2.config.mongo.url));
})
    .catch(function (err) {
    logger.error("An error occurred trying to connect to MongoDB", err);
});
app.use((0, cors_1.default)({ origin: "".concat(constants_1.PROTOCOL, "://").concat(constants_1.HOST, ":").concat(constants_1.PORT) }));
app.use(express_1.default.json({ limit: "10mb" }));
sessionManager.useSessionManagement(app);
app.use("/api/otp", otp_route_1.default);
app.post("/api/login", (0, utility_1.wrapAsync)(user_controller_1.handleLogin));
app.get("/api/issignedin", (0, utility_1.wrapAsync)(user_controller_1.isSignedIn));
app.post("/api/logout", function (req, res) {
    sessionManager.endSession(req, res);
});
app.use("/api/tags", tag_route_1.default);
app.use("/api/users", user_route_1.default);
app.use("/api/ishifts", shift_route_1.default);
app.use("/api/users/admin", user_admin_route_1.default);
app.get("/api/credentials/:email/:password", function (request, response) {
    var email = request.params.email;
    var password = request.params.password;
    var data = JSON.stringify({
        email: email,
        password: password,
        snsToken: "",
        snsPlatform: "",
    });
    var options = {
        hostname: "api.sling.is",
        port: 443,
        path: "/v1/account/login",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length,
        },
    };
    var req = https.request(options, function (res) {
        response.json(res.headers.authorization);
    });
    req.on("error", function (error) {
        console.error(error);
    });
    req.write(data);
    req.end();
});
app.get("/api/shifts/:token", function (request, response) {
    var token = request.params.token;
    var body = "";
    var options = {
        hostname: "api.sling.is",
        port: 443,
        path: "/v1/shifts/available?pagesize=20",
        method: "GET",
        credentials: "omit",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    };
    var req = https.request(options, function (res) {
        res.on("data", function (d) {
            response.json((body += d));
        });
    });
    req.on("error", function (error) {
        console.error(error);
    });
    req.end();
});
app.use("/api/qualifications", qualifications_route_1.default);
//# sourceMappingURL=index.js.map