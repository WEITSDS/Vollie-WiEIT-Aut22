"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTagById = exports.updateTagById = exports.createTag = exports.getTagById = exports.getAllTags = void 0;
var tslib_1 = require("tslib");
var tag_model_1 = tslib_1.__importDefault(require("./tag.model"));
var user_model_1 = tslib_1.__importDefault(require("../User/user.model"));
var mongoose_1 = tslib_1.__importDefault(require("mongoose"));
var tslog_1 = require("tslog");
var utility_1 = require("../utility");
var tag_interface_1 = require("./tag.interface");
var logger = new tslog_1.Logger({ name: "tag.controller" });
var getAllTags = function (_req, res, _next) {
    tag_model_1.default.find()
        .exec()
        .then(function (results) {
        return res.status(200).json({
            data: results.map(tag_interface_1.convertTagToTagSummary),
            success: true,
            message: "Retrieved matching tags",
        });
    })
        .catch(function (err) {
        (0, utility_1.handleError)(logger, res, err, "Get all tags failed");
    });
};
exports.getAllTags = getAllTags;
var getTagById = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var tag, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, tag_model_1.default.findById(req.params.id)];
            case 1:
                tag = _a.sent();
                if (!tag) {
                    res.status(404).json({
                        message: "No matching tag",
                        success: false,
                    });
                    return [2];
                }
                res.status(200).json({
                    message: "Found matching tag",
                    success: true,
                    data: (0, tag_interface_1.convertTagToTagSummary)(tag),
                });
                return [3, 3];
            case 2:
                err_1 = _a.sent();
                (0, utility_1.handleError)(logger, res, err_1, "Get tag failed");
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
exports.getTagById = getTagById;
var createTag = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var tagFields, newTag, err_2;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                    res.status(404).send();
                    return [2];
                }
                tagFields = req.body;
                if (!(0, tag_interface_1.isIBasicTag)(tagFields)) {
                    res.status(400).json({ message: "New tag request body was not valid", success: false });
                    return [2];
                }
                newTag = new tag_model_1.default({
                    id: new mongoose_1.default.Types.ObjectId(),
                    name: tagFields.name,
                    description: tagFields.description,
                });
                logger.info(newTag);
                return [4, newTag.save()];
            case 1:
                _b.sent();
                res.status(200).json({
                    message: "Tag creation success",
                    data: (0, tag_interface_1.convertTagToTagSummary)(newTag),
                    success: true,
                });
                return [3, 3];
            case 2:
                err_2 = _b.sent();
                (0, utility_1.handleError)(logger, res, err_2, "Tag creation failed");
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
exports.createTag = createTag;
var updateTagById = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var tagFields, tag, err_3;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                if (!((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                    res.status(404).send();
                    return [2];
                }
                tagFields = req.body;
                if (!(0, tag_interface_1.isIBasicTag)(tagFields)) {
                    res.status(400).json({ message: "Update tag request body was not valid", success: false });
                    return [2];
                }
                return [4, tag_model_1.default.findById(req.params.id)];
            case 1:
                tag = _b.sent();
                if (!tag) {
                    res.status(404).json({
                        message: "Could not find matching tag",
                        success: false,
                    });
                    return [2];
                }
                tag.name = tagFields.name;
                tag.description = tagFields.description;
                return [4, tag.save()];
            case 2:
                _b.sent();
                res.status(200).json({
                    message: "Updated tag",
                    data: (0, tag_interface_1.convertTagToTagSummary)(tag),
                    success: true,
                });
                return [3, 4];
            case 3:
                err_3 = _b.sent();
                (0, utility_1.handleError)(logger, res, err_3, "Update tag failed");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.updateTagById = updateTagById;
var deleteTagById = function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var tag, err_4;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (!((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                    res.status(404).send();
                    return [2];
                }
                return [4, tag_model_1.default.findById(req.params.id)];
            case 1:
                tag = _b.sent();
                if (!tag) {
                    res.status(404).json({
                        message: "Could not find matching tag",
                        success: false,
                    });
                    return [2];
                }
                return [4, tag.remove()];
            case 2:
                _b.sent();
                return [4, user_model_1.default.updateMany({ _id: tag.users }, { $pull: { tags: tag._id } })];
            case 3:
                _b.sent();
                res.status(200).json({
                    message: "Deleted tag",
                    data: (0, tag_interface_1.convertTagToTagSummary)(tag),
                    success: true,
                });
                return [3, 5];
            case 4:
                err_4 = _b.sent();
                (0, utility_1.handleError)(logger, res, err_4, "Delete tag failed");
                return [3, 5];
            case 5: return [2];
        }
    });
}); };
exports.deleteTagById = deleteTagById;
//# sourceMappingURL=tag.controller.js.map