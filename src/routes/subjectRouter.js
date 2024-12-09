"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const subjectController = require("../controllers/subject.controller");

router.post("/", asyncHandler(subjectController.newSubject)); // Tạo mới một subject
router.get("/", asyncHandler(subjectController.subjectList)); // Liệt kê tất cả subjects
router.delete("/", asyncHandler(subjectController.subjectDelete)); // Xóa một subject
router.put("/:id", asyncHandler(subjectController.subjectUpdate)); // Cập nhật subject
router.post("/bulk", asyncHandler(subjectController.newSubjectsBulk)); // Tạo mới hàng loạt subjects

module.exports = router;
