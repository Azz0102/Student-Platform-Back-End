"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const classSessionController = require("../controllers/classSession.controller");

router.post("/", asyncHandler(classSessionController.newClassSession)); // Tạo mới một ClassSession
router.get("/", asyncHandler(classSessionController.classSessionList)); // Liệt kê tất cả ClassSessions
router.get("/list", asyncHandler(classSessionController.classSessionListss)); // Liệt kê tất cả ClassSessions
router.delete("/", asyncHandler(classSessionController.classSessionDelete)); // Xóa một ClassSession
router.put("/:id", asyncHandler(classSessionController.classSessionUpdate)); // Cập nhật ClassSession
router.post("/bulk", asyncHandler(classSessionController.newClassSessionsBulk)); // Tạo mới hàng loạt ClassSessions

router.post(
    "/user",
    asyncHandler(classSessionController.userGetSpecificClassSession)
);

module.exports = router;
