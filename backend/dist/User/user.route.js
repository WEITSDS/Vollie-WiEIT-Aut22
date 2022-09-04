"use strict";
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var utility_1 = require("../utility");
var user_controller_1 = require("./user.controller");
var router = express_1.default.Router();
router.get("/", user_controller_1.getAllUsers);
router.get("/self", (0, utility_1.wrapAsync)(user_controller_1.getOwnUser));
router.get("/:id", user_controller_1.getUserById);
router.post("/create", user_controller_1.createUser);
router.post("/resetpassword", user_controller_1.setUserPassword);
router.get("/owntags", (0, utility_1.wrapAsync)(user_controller_1.getOwnTags));
module.exports = router;
//# sourceMappingURL=user.route.js.map