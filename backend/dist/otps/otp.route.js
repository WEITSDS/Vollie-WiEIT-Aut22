"use strict";
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var otp_controller_1 = require("./otp.controller");
var otpRouter = express_1.default.Router();
otpRouter.post("/verify", otp_controller_1.verifyOTPForUser);
otpRouter.post("/send", otp_controller_1.triggerOTPEmail);
module.exports = otpRouter;
//# sourceMappingURL=otp.route.js.map