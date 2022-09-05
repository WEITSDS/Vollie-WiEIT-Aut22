"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCancelledShiftEmail = exports.sendSignedUpShiftEmail = exports.sendOTPEmail = void 0;
var tslib_1 = require("tslib");
var nodemailer = tslib_1.__importStar(require("nodemailer"));
var tslog_1 = require("tslog");
var constants_1 = require("../constants");
var otpManager_1 = require("../otps/otpManager");
var logger = new tslog_1.Logger({ name: "mailer" });
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: constants_1.EMAIL_USER,
        clientId: constants_1.EMAIL_CLIENT_ID,
        clientSecret: constants_1.EMAIL_CLIENT_SECRET,
        refreshToken: constants_1.EMAIL_REFRESH_TOKEN,
        accessToken: constants_1.EMAIL_ACCESS_TOKEN,
    },
});
function sendOTPEmail(userFirstName, userEmail) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var userOTP, content;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userOTP = (0, otpManager_1.generateOTPForUser)(userEmail);
                    logger.debug("OTP for '".concat(userEmail, "': ").concat(userOTP));
                    content = "Hey ".concat(userFirstName, ",\n\nHere's the one time password you requested:\n").concat(userOTP);
                    return [4, sendEmail("Your ".concat(constants_1.SITE_NAME, " One Time Password"), content, userEmail)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.sendOTPEmail = sendOTPEmail;
function sendSignedUpShiftEmail(userFirstName, userEmail, shift) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var content;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.debug("Sending shift signup email for '".concat(userEmail, "' for shift ''").concat(shift.name));
                    content = "Hey ".concat(userFirstName, ",\n\n") +
                        "You've signed up for the shift '".concat(shift.name, "' at ").concat(shift.location, " from ").concat(shift.startTime, " to ").concat(shift.endTime, ". See you there!");
                    return [4, sendEmail("Your ".concat(constants_1.SITE_NAME, " Shift Details"), content, userEmail)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.sendSignedUpShiftEmail = sendSignedUpShiftEmail;
function sendCancelledShiftEmail(userFirstName, userEmail, shift) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var content;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.debug("Sending shift cancelled email for '".concat(userEmail, "' for shift ''").concat(shift.name));
                    content = "Hey ".concat(userFirstName, ",\n\nYour shift '").concat(shift.name, "' at ").concat(shift.startTime, " at ").concat(shift.location, " was cancelled.");
                    return [4, sendEmail("Your ".concat(constants_1.SITE_NAME, " Shift Has Been Cancelled"), content, userEmail)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.sendCancelledShiftEmail = sendCancelledShiftEmail;
function sendEmail(subject, content, toEmail, ccEmail, isHTML) {
    if (ccEmail === void 0) { ccEmail = ""; }
    if (isHTML === void 0) { isHTML = false; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var toEmails, ccEmails, options, sentMessageInfo, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    toEmails = typeof toEmail === "string" ? toEmail : toEmail.join(", ");
                    ccEmails = typeof ccEmail === "string" ? ccEmail : ccEmail.join(", ");
                    options = {
                        from: constants_1.EMAIL_USER,
                        to: toEmails,
                        cc: ccEmails,
                        subject: subject,
                        text: !isHTML ? content : undefined,
                        html: isHTML ? content : undefined,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, transporter.sendMail(options)];
                case 2:
                    sentMessageInfo = _a.sent();
                    if (sentMessageInfo.rejected) {
                    }
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    logger.error(error_1);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
//# sourceMappingURL=mailer.js.map