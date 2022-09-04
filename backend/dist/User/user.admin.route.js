"use strict";
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var utility_1 = require("../utility");
var user_controller_1 = require("./user.controller");
var adminRouter = express_1.default.Router();
adminRouter.post("/batchchangetag", (0, utility_1.wrapAsync)(user_controller_1.batchChangeUserTag));
adminRouter.post("/setadmin", (0, utility_1.wrapAsync)(user_controller_1.setUserIsAdmin));
module.exports = adminRouter;
//# sourceMappingURL=user.admin.route.js.map