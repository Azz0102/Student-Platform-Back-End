"use strict";

const express = require("express");
const router = express.Router();
const semesterController = require("../controllers/semester.controller");

router.post("/", semesterController.newSemester); // Tạo mới một semester
router.get("/", semesterController.semesterList); // Liệt kê tất cả semesters
router.delete("/:id", semesterController.semesterDelete); // Xóa một semester
router.put("/:id", semesterController.semesterUpdate); // Cập nhật semester
router.post("/bulk", semesterController.newSemestersBulk); // Tạo mới hàng loạt semesters

module.exports = router;
