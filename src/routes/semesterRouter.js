"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const semesterController = require("../controllers/semester.controller");

router.post("/", asyncHandler(semesterController.newSemester)); // Tạo mới một semester
router.get("/:id", asyncHandler(semesterController.semesterData));
router.get("/", asyncHandler(semesterController.semesterList)); // Liệt kê tất cả semesters
router.delete("/:id", asyncHandler(semesterController.semesterDelete)); // Xóa một semester
router.put("/:id", asyncHandler(semesterController.semesterUpdate)); // Cập nhật semester
router.post("/bulk", asyncHandler(semesterController.newSemestersBulk)); // Tạo mới hàng loạt semesters


module.exports = router;
