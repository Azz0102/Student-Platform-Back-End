"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const userSessionDetailsController = require("../controllers/userSessionDetails.controller");

router.post("/", asyncHandler(userSessionDetailsController.userSessionDetailsCre)); // Tạo mới một userSessionDetails
router.get("/", asyncHandler(userSessionDetailsController.userSessionDetailsList)); // Liệt kê tất cả userSessionDetails
router.delete("/", asyncHandler(userSessionDetailsController.userSessionDetailsDelete)); // Xóa một userSessionDetails
// router.put("/:id", asyncHandler(subjectController.subjectUpdate)); // Cập nhật userSessionDetails
router.post("/bulk", asyncHandler(userSessionDetailsController.createMultipleUserSessionDetail)); // Tạo mới hàng loạt userSessionDetails

module.exports = router;