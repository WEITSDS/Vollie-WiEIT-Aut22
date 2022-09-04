"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnUser = exports.getOwnTags = exports.setUserIsAdmin = exports.batchChangeUserTag = exports.isSignedIn = exports.handleLogin = exports.createUser = exports.setUserPassword = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = void 0;
var tslib_1 = require("tslib");
var user_model_1 = tslib_1.__importDefault(require("./user.model"));
var tag_model_1 = tslib_1.__importDefault(require("../Tag/tag.model"));
var mongoose_1 = tslib_1.__importDefault(require("mongoose"));
var tslog_1 = require("tslog");
var sessionManager = tslib_1.__importStar(require("../Common/middleware/sessionManagement"));
var utility_1 = require("../utility");
var user_interface_1 = require("./user.interface");
var bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
var logger = new tslog_1.Logger({ name: "user.controller" });
var getAllUsers = function (_req, res, _next) {
    user_model_1.default.find()
        .populate("tags")
        .exec()
        .then(function (results) {
        return res.status(200).json({
            data: results.map(user_interface_1.mapUserToUserSummary),
            success: true,
            message: "Retrieved all users",
        });
    })
        .catch(function (err) {
        (0, utility_1.handleError)(logger, res, err, "Get all users failed");
    });
};
exports.getAllUsers = getAllUsers;
var getUserById = function (req, res, _next) {
    user_model_1.default.findById(req.params.id)
        .populate("tags")
        .exec()
        .then(function (foundUser) {
        if (!foundUser) {
            res.status(404).json({
                message: "Not found",
                success: false,
            });
            return;
        }
        res.status(200).json({
            message: "Found a matching user",
            data: (0, user_interface_1.mapUserToUserSummary)(foundUser),
            success: true,
        });
    })
        .catch(function (err) {
        (0, utility_1.handleError)(logger, res, err, "Find singular user failed");
    });
};
exports.getUserById = getUserById;
var getUserByEmail = function (email) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var results, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!email)
                    return [2, undefined];
                return [4, user_model_1.default.findOne({ email: email }).populate("tags")];
            case 1:
                results = (_a.sent()) || undefined;
                return [2, results];
            case 2:
                err_1 = _a.sent();
                logger.error(err_1);
                return [2, undefined];
            case 3: return [2];
        }
    });
}); };
exports.getUserByEmail = getUserByEmail;
function isResetPasswordBody(args) {
    var partial = args;
    return typeof args === "object" && typeof partial.password === "string" && typeof partial.email === "string";
}
var setUserPassword = function (req, res, _next) {
    var newInfo = req.body;
    if (!isResetPasswordBody(newInfo)) {
        res.status(400).json({ message: "Password reset request body was not valid", success: false });
        return;
    }
    var requestingUser = req.session.user;
    if (requestingUser == null) {
        res.status(401).json({ message: "Must be logged in to reset password", success: false });
        return;
    }
    if (newInfo.email !== requestingUser.email && !requestingUser.isAdmin) {
        res.status(403).json({ message: "Cannot set password for another user", success: false });
        return;
    }
    user_model_1.default.findOne({ email: newInfo.email })
        .exec()
        .then(function (result) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var notFound, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    notFound = "User could not be found";
                    if (!result) {
                        (0, utility_1.handleError)(logger, res, notFound, notFound, 404);
                        return [2];
                    }
                    result.password = newInfo.password;
                    return [4, result.save()];
                case 1:
                    _a.sent();
                    res.status(200).json({
                        message: "Reset password",
                        success: true,
                    });
                    return [3, 3];
                case 2:
                    err_2 = _a.sent();
                    (0, utility_1.handleError)(logger, res, err_2, "Set password failed");
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); })
        .catch(function (err) {
        (0, utility_1.handleError)(logger, res, err, "Set password failed");
    });
};
exports.setUserPassword = setUserPassword;
var createUser = function (req, res) {
    var userFields = req.body;
    if (!(0, user_interface_1.isIBasicUser)(userFields)) {
        res.status(400).json({ message: "New user request body was not valid", success: false });
        return;
    }
    user_model_1.default.findOne({ email: userFields.email })
        .exec()
        .then(function (existingUser) {
        if (existingUser != null) {
            logger.warn(existingUser);
            res.json({
                message: "Email Already Exists",
                status: false,
            });
        }
        var newUser = new user_model_1.default({
            email: userFields.email,
            password: userFields.password,
            firstName: userFields.firstName,
            lastName: userFields.lastName,
            lastLogin: 0,
        });
        newUser.id = new mongoose_1.default.Types.ObjectId();
        logger.info(newUser);
        newUser
            .save()
            .then(function (results) {
            return res.status(200).json({
                message: "User register success",
                data: (0, user_interface_1.mapUserToUserSummary)(results),
                success: true,
            });
        })
            .catch(function (err) {
            (0, utility_1.handleError)(logger, res, err, "User registration failed");
        });
    })
        .catch(function (err) {
        (0, utility_1.handleError)(logger, res, err, "User registration failed");
    });
};
exports.createUser = createUser;
function isLoginBody(args) {
    var p = args;
    return typeof p === "object" && typeof p.email === "string" && typeof p.password === "string";
}
var handleLogin = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    let loginDetails, email, password, foundUser, err_3, id;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                loginDetails = req.body;
                if (!isLoginBody(loginDetails)) {
                    res.status(400).json({ message: "Login request body was not valid", success: false });
                    return [2];
                }
                email = loginDetails.email, password = loginDetails.password;
                return [4, user_model_1.default.findOne({ email: email })];
            case 1:
                foundUser = _a.sent();
                if (!(foundUser && bcrypt_1.default.compareSync(password, foundUser.password))) {
                    res.status(400).json({
                        message: "Login failed, email and password combination was incorrect",
                        success: false,
                    });
                    return [2];
                }
                foundUser.lastLogin = Date.now();
                id = foundUser._id
                return [4, foundUser.save()];
            case 2:
                _a.sent();
                sessionManager.createSession(req, { _id: id, email: email, isAdmin: (foundUser === null || foundUser === void 0 ? void 0 : foundUser.isAdmin) || false });
                res.status(200).json({ message: "Logged in successfully", success: true });
                return [3, 4];
            case 3:
                err_3 = _a.sent();
                (0, utility_1.handleError)(logger, res, err_3, "An unexpected error occurred");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.handleLogin = handleLogin;
var isSignedIn = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var requestingUser, _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.session.user) return [3, 2];
                return [4, user_model_1.default.findOne({ email: req.session.user.email })];
            case 1:
                _a = _b.sent();
                return [3, 3];
            case 2:
                _a = undefined;
                _b.label = 3;
            case 3:
                requestingUser = _a;
                if (requestingUser == null) {
                    res.status(401).json({ message: "Not signed in", success: false });
                    return [2];
                }
                res.status(200).json({
                    message: "Signed in",
                    success: true,
                    data: { isAdmin: requestingUser.isAdmin },
                });
                return [2];
        }
    });
}); };
exports.isSignedIn = isSignedIn;
function isBatchUserTagBody(args) {
    var partial = args;
    return (typeof args === "object" &&
        typeof partial.userId === "string" &&
        partial.tagIds != null &&
        Array.isArray(partial.tagIds) &&
        (partial.tagIds.length === 0 || typeof partial.tagIds[0] === "string"));
}
var batchChangeUserTag = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var reqInfo, requestingUser, tagIds_1, userId, tagObjIds, tags, user, ogTags_1, removedTags, addedTags, err_4;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                if (!((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                    res.status(404).send();
                    return [2];
                }
                reqInfo = req.body;
                if (!isBatchUserTagBody(reqInfo)) {
                    res.status(400).json({ message: "Batch user tag change request body was not valid", success: false });
                    return [2];
                }
                requestingUser = req.session.user;
                if (requestingUser == null) {
                    res.status(401).json({ message: "Must be logged in to reset password", success: false });
                    return [2];
                }
                tagIds_1 = reqInfo.tagIds, userId = reqInfo.userId;
                tagObjIds = tagIds_1.map(function (tId) { return new mongoose_1.default.Types.ObjectId(tId); });
                return [4, tag_model_1.default.find({ _id: { $in: tagObjIds } })];
            case 1:
                tags = _b.sent();
                return [4, user_model_1.default.findById(userId).populate("tags")];
            case 2:
                user = _b.sent();
                if (!(tags && user)) {
                    res.status(404).json({
                        message: "".concat([
                            user == null ? "User could not be found." : "",
                            tags == null ? "Tags could not be found." : "",
                        ].join(" ")),
                        success: false,
                    });
                    return [2];
                }
                ogTags_1 = user.tags.map(function (t) { return t._id; });
                removedTags = ogTags_1.filter(function (o) { return !tagIds_1.includes(o); }).map(function (tId) { return new mongoose_1.default.Types.ObjectId(tId); });
                addedTags = tagIds_1.filter(function (o) { return !ogTags_1.includes(o); }).map(function (tId) { return new mongoose_1.default.Types.ObjectId(tId); });
                return [4, user.update({ $set: { tags: tags.map(function (t) { return t._id; }) } })];
            case 3:
                _b.sent();
                return [4, tag_model_1.default.updateMany({ _id: { $in: removedTags } }, { $pull: { users: user._id } })];
            case 4:
                _b.sent();
                return [4, tag_model_1.default.updateMany({ _id: { $in: addedTags } }, { $push: { users: user._id } })];
            case 5:
                _b.sent();
                res.status(200).json({
                    message: "Successfully updated tags for user",
                    success: true,
                });
                return [3, 7];
            case 6:
                err_4 = _b.sent();
                (0, utility_1.handleError)(logger, res, err_4, "Batch change user tag failed");
                return [3, 7];
            case 7: return [2];
        }
    });
}); };
exports.batchChangeUserTag = batchChangeUserTag;
function isSetAdminBody(args) {
    var partial = args;
    return typeof args === "object" && typeof partial.userId === "string" && typeof partial.makeAdmin === "boolean";
}
var setUserIsAdmin = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var reqInfo, requestingUser, userId, makeAdmin, user, err_5;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                if (!((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                    res.status(404).send();
                    return [2];
                }
                reqInfo = req.body;
                requestingUser = req.session.user;
                if (!isSetAdminBody(reqInfo)) {
                    res.status(400).json({
                        message: "Change user administrator flag request body was not valid",
                        success: false,
                    });
                    return [2];
                }
                else if (requestingUser == null) {
                    res.status(401).json({ message: "Not logged in", success: false });
                    return [2];
                }
                userId = reqInfo.userId, makeAdmin = reqInfo.makeAdmin;
                return [4, user_model_1.default.findById(userId)];
            case 1:
                user = _b.sent();
                if (!user) {
                    res.status(404).json({
                        message: "User could not be found.",
                        success: false,
                    });
                    return [2];
                }
                else if (requestingUser.email === user.email) {
                    res.status(400).json({ message: "Cannot change own administrator flag", success: false });
                    return [2];
                }
                user.isAdmin = makeAdmin;
                return [4, user.save()];
            case 2:
                _b.sent();
                res.status(200).json({
                    message: "Successfully ".concat(makeAdmin ? "added" : "removed", " administrator flag for user"),
                    success: true,
                });
                return [3, 4];
            case 3:
                err_5 = _b.sent();
                (0, utility_1.handleError)(logger, res, err_5, "Change user administrator flag failed");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.setUserIsAdmin = setUserIsAdmin;
var getOwnTags = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var requestingUser, user, err_6;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                requestingUser = req.session.user;
                if (requestingUser == null) {
                    res.status(401).json({ message: "Must be logged in", success: false });
                    return [2];
                }
                return [4, user_model_1.default.findOne({ email: requestingUser.email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ message: "Could not find user", success: false });
                    return [2];
                }
                res.status(200).json({ message: "Got own tags", data: user.tags, success: true });
                return [3, 3];
            case 2:
                err_6 = _a.sent();
                (0, utility_1.handleError)(logger, res, err_6, "Get own tags failed");
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
exports.getOwnTags = getOwnTags;
var getOwnUser = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var requestingUser, user, err_7;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                requestingUser = req.session.user;
                if (requestingUser == null) {
                    res.status(401).json({ message: "Must be logged in", success: false });
                    return [2];
                }
                return [4, user_model_1.default.findOne({ email: requestingUser.email }).populate("tags").populate("qualifications")];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ message: "Could not find user", success: false });
                    return [2];
                }
                res.status(200).json({ message: "Got own user", data: (0, user_interface_1.mapUserToUserSummary)(user), success: true });
                return [3, 3];
            case 2:
                err_7 = _a.sent();
                (0, utility_1.handleError)(logger, res, err_7, "Get own user failed");
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
exports.getOwnUser = getOwnUser;
//# sourceMappingURL=user.controller.js.map