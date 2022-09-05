"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPForUser = exports.triggerOTPEmail = void 0;
var tslib_1 = require("tslib");
var sessionManager = tslib_1.__importStar(require("../Common/middleware/sessionManagement"));
var otpManager_1 = require("./otpManager");
var user_controller_1 = require("../User/user.controller");
var tslog_1 = require("tslog");
var utility_1 = require("../utility");
var mailer_1 = require("../mailer/mailer");
var otp_model_1 = require("./otp.model");
function isOTPRequestBody(args) {
    var body = args;
    return typeof body === "object" && typeof body.email === "string";
}
var logger = new tslog_1.Logger({ name: "otp.controller" });
function triggerOTPEmail(req, res, _next) {
    var reqBody = req.body;
    if (!isOTPRequestBody(reqBody)) {
        res.status(400).json({ success: true, message: "OTP request body was not valid" });
        return;
    }
    (0, user_controller_1.getUserByEmail)(reqBody.email)
        .then(function (user) {
        if (!user) {
            (0, utility_1.handleError)(logger, res, "Could not find user '".concat(reqBody.email, "' to send OTP to"), "An unexpected error occured", 404);
            return;
        }
        void (0, mailer_1.sendOTPEmail)(user.firstName, user.email);
        res.status(200).json({ success: true, message: "Sent OTP email" });
    })
        .catch(function (err) {
        (0, utility_1.handleError)(logger, res, err, "An unexpected error occured");
    });
}
exports.triggerOTPEmail = triggerOTPEmail;
function verifyOTPForUser(req, res, _next) {
    var _this = this;
    var otpBody = req.body;
    if (!(0, otp_model_1.isOTPQuery)(otpBody)) {
        res.status(400).json({ success: false, message: "OTP verification request body was not valid" });
        return;
    }
    var isValid = (0, otpManager_1.checkIfOTPValidAndRemove)(otpBody);
    if (!isValid) {
        res.status(400).json({ success: false, message: "OTP was not valid" });
        return;
    }
    (0, user_controller_1.getUserByEmail)(otpBody.email)
        .then(function (user) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!user) {
                        (0, utility_1.handleError)(logger, res, "Null user despite a valid OTP", "An unexpected error occured");
                        return [2];
                    }
                    if (!req.session.user) {
                        sessionManager.createSession(req, { _id: user._id, email: user.email, isAdmin: user.isAdmin });
                    }
                    if (!!user.verified) return [3, 2];
                    user.verified = true;
                    return [4, user.save()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    res.status(200).json({ success: true, message: "OTP successfully verified" });
                    return [3, 4];
                case 3:
                    err_1 = _a.sent();
                    (0, utility_1.handleError)(logger, res, err_1, "An unexpected error occured");
                    return [3, 4];
                case 4: return [2];
            }
        });
    }); })
        .catch(function (err) {
        (0, utility_1.handleError)(logger, res, err, "An unexpected error occured");
    });
}
exports.verifyOTPForUser = verifyOTPForUser;
//# sourceMappingURL=otp.controller.js.map