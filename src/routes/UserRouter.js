"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticationV2 } = require("../auth/authUtils");
const { asyncHandler } = require("../helpers/asyncHandler");

// router.use(authenticationV2);

router.post("/login", asyncHandler(userController.login));
router.post("/logout", asyncHandler(userController.logout));
router.post("/verification", asyncHandler(userController.verification));
router.post("/forgot-password", asyncHandler(userController.forgotPassword));
router.patch("/update-forgot-password", asyncHandler(userController.updateForgotPassword));
router.patch("/update-password", asyncHandler(userController.updatePassword));

module.exports = router;
