"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const gradeController = require("../controllers/grade.controller");

router.post("/", asyncHandler(gradeController.newGrade)); // Tạo mới một grade
router.get("/", asyncHandler(gradeController.gradeList)); // Liệt kê tất cả grade
router.delete("/", asyncHandler(gradeController.gradeDelete)); // Xóa một grade
// router.put("/:id", asyncHandler(subjectController.subjectUpdate)); // Cập nhật grade
router.post("/bulk", asyncHandler(gradeController.newGradesBulks)); // Tạo mới hàng loạt grade

module.exports = router;