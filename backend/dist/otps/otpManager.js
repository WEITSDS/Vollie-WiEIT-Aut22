"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfOTPValidAndRemove = exports.generateOTPForUser = void 0;
var tslib_1 = require("tslib");
var OTPManager = (function () {
    function OTPManager() {
        var _this = this;
        this.otpStore = new Map();
        this.clearOldOTPs = function () {
            var e_1, _a;
            try {
                for (var _b = tslib_1.__values(tslib_1.__spreadArray([], tslib_1.__read(_this.otpStore), false)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = tslib_1.__read(_c.value, 2), email = _d[0], entry = _d[1];
                    if (OTPManager.hasOTPExpired(entry)) {
                        _this.otpStore.delete(email);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        var msInAQuarterDay = 0.25 * 24 * 60 * 60 * 1000;
        setInterval(this.clearOldOTPs, msInAQuarterDay);
    }
    OTPManager.generateOTP = function (numDigits) {
        if (numDigits === void 0) { numDigits = 6; }
        return Math.random().toFixed(numDigits).substring(2);
    };
    OTPManager.hasOTPExpired = function (entry) {
        return entry.timeGenerated + OTPManager.OTP_DURATION < Date.now();
    };
    OTPManager.prototype.createOTPForUser = function (email) {
        var code = OTPManager.generateOTP();
        this.otpStore.set(email, { code: code, timeGenerated: Date.now() });
        return code;
    };
    OTPManager.prototype.isOTPValid = function (_a) {
        var email = _a.email, code = _a.code;
        var entry = this.otpStore.get(email);
        return entry != null && !OTPManager.hasOTPExpired(entry) && entry.code === code;
    };
    OTPManager.prototype.removeOTPForUser = function (email) {
        return this.otpStore.delete(email);
    };
    OTPManager.OTP_DURATION = 60 * 60 * 1000;
    return OTPManager;
}());
var otpManager = new OTPManager();
function generateOTPForUser(email) {
    return otpManager.createOTPForUser(email);
}
exports.generateOTPForUser = generateOTPForUser;
function checkIfOTPValidAndRemove(query) {
    if (otpManager.isOTPValid(query)) {
        otpManager.removeOTPForUser(query.email);
        return true;
    }
    return false;
}
exports.checkIfOTPValidAndRemove = checkIfOTPValidAndRemove;
//# sourceMappingURL=otpManager.js.map