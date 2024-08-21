"use strict";

const express = require("express");
const router = express.Router();
const {
    schedulingClassSession,
    signUpController,
    signUpMultipleUsersController,
    publish,
} = require("../controllers/admin.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");

router.get(
    "/scheduling",
    grantAccess("readAny", "classSession"),
    grantAccess("readAny", "classRoom"),
    grantAccess("readAny", "sessionDetail"),
    asyncHandler(schedulingClassSession)
);
router.post("/sign-up", asyncHandler(signUpController));
router.post("/sign-up-multiple", asyncHandler(signUpMultipleUsersController));
router.post("/noti", asyncHandler(publish));

module.exports = router;
