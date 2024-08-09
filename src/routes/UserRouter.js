"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticationV2 } = require("../auth/authUtils");
const { asyncHandler } = require("../helpers/asyncHandler");

// router.use(authenticationV2);

router.post("/login", asyncHandler(userController.login));
router.post("/logout", asyncHandler(userController.logout));

module.exports = router;
