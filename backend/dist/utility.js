"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsync = exports.handleError = void 0;
function handleError(loggerObj, res, err, message, status) {
    if (status === void 0) { status = 500; }
    loggerObj.error(err);
    return res.status(status).json({
        message: message,
        err: err,
        success: false,
    });
}
exports.handleError = handleError;
function wrapAsync(fn) {
    return function (req, res, next) {
        var fnReturn = fn(req, res);
        Promise.resolve(fnReturn).catch(next);
    };
}
exports.wrapAsync = wrapAsync;
//# sourceMappingURL=utility.js.map