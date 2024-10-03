"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticationV2 } = require("../auth/authUtils");
const { asyncHandler } = require("../helpers/asyncHandler");

router.post("/login", asyncHandler(userController.login));
router.post("/logout", asyncHandler(userController.logout));
router.post("/verification", asyncHandler(userController.verification));


router.post("/forgot-password", asyncHandler(userController.forgotPassword));
router.get("/reset-password/:token", asyncHandler(userController.resetPassword));
router.post("/reset-password", asyncHandler(userController.resetPasswordToken));



router.use(authenticationV2);

router.patch("/update-password", asyncHandler(userController.updatePassword));

module.exports = router;
