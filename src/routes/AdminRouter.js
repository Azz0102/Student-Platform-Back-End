"use strict";

const express = require("express");
const router = express.Router();
const { schedulingClassSession } = require("../controllers/admin.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");

router.get(
    "/scheduling",
    grantAccess("readAny", "classSession"),
    grantAccess("readAny", "classRoom"),
    grantAccess("readAny", "sessionDetail"),
    asyncHandler(schedulingClassSession)
);

module.exports = router;
