"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const subscription = require("../controllers/subscription.controller");

router.post("/", asyncHandler(subscription.newSubScription)); // Tạo mới một subject

module.exports = router;
