"use strict";

const express = require("express");
const router = express.Router();
const {
    userSubscribe,
    userUnsubscribe,
} = require("../controllers/channel.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");
const { authenticationV2 } = require("../auth/authUtils");

// router.use(authenticationV2);

router.post("/subscribe", asyncHandler(userSubscribe));
router.post("/unsubscribe", asyncHandler(userUnsubscribe));

module.exports = router;
