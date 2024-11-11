"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const enrollmentController = require("../controllers/enrollment.controller");

// Tạo mới một enrollment
router.post("/", asyncHandler(enrollmentController.newEnrollment));

// Xóa một enrollment
router.delete("/", asyncHandler(enrollmentController.enrollmentDelete));

// Tạo mới hàng loạt enrollments
router.post("/bulk", asyncHandler(enrollmentController.newManyEnrollments));

// Xóa hàng loạt enrollments
router.delete("/bulk", asyncHandler(enrollmentController.removeManyEnrollments));

// Liệt kê enrollments theo UserId
router.get("/user/:userId", asyncHandler(enrollmentController.enrollmentListByUser));

module.exports = router;
