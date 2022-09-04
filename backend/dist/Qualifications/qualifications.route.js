"use strict";
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var qualifications_controller_1 = require("./qualifications.controller");
var utility_1 = require("../utility");
var router = express_1.default.Router();
router.delete("/:id", (0, utility_1.wrapAsync)(qualifications_controller_1.deleteQualificationById));
router.post("/:id/update", (0, utility_1.wrapAsync)(qualifications_controller_1.updateQualificationById));
router.post("/create", (0, utility_1.wrapAsync)(qualifications_controller_1.createQualification));
router.get("/self", (0, utility_1.wrapAsync)(qualifications_controller_1.getOwnQualifications));
router.get("/user/:id", (0, utility_1.wrapAsync)(qualifications_controller_1.getQualificationsForUserId));
module.exports = router;
//# sourceMappingURL=qualifications.route.js.map