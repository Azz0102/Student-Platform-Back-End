const express = require("express");
const router = express.Router();
const { getListNoti, changeNotiUser } = require("../controllers/notification.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

router.get("/:userId", asyncHandler(getListNoti));
router.patch("/", asyncHandler(changeNotiUser));

module.exports = router;
