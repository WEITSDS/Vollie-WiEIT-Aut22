"use strict";
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var utility_1 = require("../utility");
var shift_controller_1 = require("./shift.controller");
var router = express_1.default.Router();
router.post("/create", shift_controller_1.createShift);
router.patch("/assign-user/:shiftid", (0, utility_1.wrapAsync)(shift_controller_1.assignUser));
router.delete("/assign-user/:shiftid", (0, utility_1.wrapAsync)(shift_controller_1.removeUser));
router.delete("/delete", shift_controller_1.deleteShift);
module.exports = router;
//# sourceMappingURL=shift.route.js.map