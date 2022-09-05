"use strict";
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var utility_1 = require("../utility");
var tag_controller_1 = require("./tag.controller");
var router = express_1.default.Router();
router.get("/", tag_controller_1.getAllTags);
router.get("/:id", (0, utility_1.wrapAsync)(tag_controller_1.getTagById));
var adminRoutes = express_1.default.Router();
adminRoutes.delete("/:id", (0, utility_1.wrapAsync)(tag_controller_1.deleteTagById));
adminRoutes.post("/:id/update", (0, utility_1.wrapAsync)(tag_controller_1.updateTagById));
adminRoutes.post("/create", (0, utility_1.wrapAsync)(tag_controller_1.createTag));
router.use(adminRoutes);
module.exports = router;
//# sourceMappingURL=tag.route.js.map