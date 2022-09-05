"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mongoose_1 = tslib_1.__importDefault(require("mongoose"));
var mongoose_2 = require("mongoose");
var bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
var UserSchema = new mongoose_2.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    lastLogin: { type: Number, required: true },
    verified: { type: Boolean, default: false, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    qualifications: [{ type: mongoose_1.default.Types.ObjectId, ref: "Qualification" }],
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: "Tag" }],
}, {
    timestamps: true,
});
UserSchema.pre("save", function (next) {
    var _this = this;
    var salt = 10;
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt_1.default.hash(this.password, salt, function (err, hash) {
        if (err)
            return next(err);
        _this.password = hash;
        next();
    });
});
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=user.model.js.map