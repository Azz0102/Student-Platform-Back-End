"use strict";

const express = require("express");
const router = express.Router();
const {
    schedulingClassSession,
    signUpController,
    signUpMultipleUsersController,
    publish,
    savedSchedule,
} = require("../controllers/admin.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");
const { authenticationV2 } = require("../auth/authUtils");

// router.use(authenticationV2);

router.post(
    "/scheduling",
    grantAccess("readAny", "classSession"),
    grantAccess("readAny", "classRoom"),
    asyncHandler(schedulingClassSession)
);

router.patch(
    "/save-schedule",
    grantAccess("updateAny", "classSession"),
    asyncHandler(savedSchedule)
);

router.post(
    "/sign-up",
    // grantAccess("createAny", "classSession"),
    asyncHandler(signUpController)
);
router.post(
    "/sign-up-multiple",
    // grantAccess("createAny", "user"),
    asyncHandler(signUpMultipleUsersController)
);
router.post(
    "/noti",
    // grantAccess("createAny", "notification"),
    asyncHandler(publish)
);

module.exports = router;
