"use strict";

const express = require("express");
const router = express.Router();
const {
    schedulingClassSessionController,
    signUpController,
    signUpMultipleUsersController,
    publish,
    savedSchedule,
    getlistUser,
    deleteUserById,
    deleteListUsers,
    updateUserById,
} = require("../controllers/admin.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");
const { authenticationV2 } = require("../auth/authUtils");

// router.use(authenticationV2);

router.post(
    "/scheduling",
    // grantAccess("readAny", "classSession"),
    // grantAccess("readAny", "classRoom"),
    asyncHandler(schedulingClassSessionController)
);

router.patch(
    "/save-schedule",
    // grantAccess("updateAny", "classSession"),
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

router.get("/user", asyncHandler(getlistUser)); // Liệt kê user
router.patch("/user", asyncHandler(updateUserById)); // Cap nhat user bang Id
router.delete("/user", asyncHandler(deleteUserById)); // Xoa user bang Id
router.delete("/user-list", asyncHandler(deleteListUsers)); // Xoa user bang Id


module.exports = router;
