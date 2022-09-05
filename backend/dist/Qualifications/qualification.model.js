"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mongoose_1 = tslib_1.__importDefault(require("mongoose"));
var mongoose_2 = require("mongoose");
var QualificationSchema = new mongoose_2.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    filePath: { type: String, required: true },
    fileId: { type: String, required: true },
    user: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Qualification", QualificationSchema);
//# sourceMappingURL=qualification.model.js.map