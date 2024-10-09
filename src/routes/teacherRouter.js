const express = require("express");
const {
    newTeacher,
    teacherList,
    teacherDelete,
    teacherUpdate,
    newMultipleTeachers,
} = require("../controllers/teacher.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(newTeacher)); // Tạo mới Teacher
router.get("/", asyncHandler(teacherList)); // Liệt kê tất cả Teachers
router.delete("/:id", asyncHandler(teacherDelete)); // Xóa một Teacher theo ID
router.put("/:id", asyncHandler(teacherUpdate)); // Cập nhật Teacher theo ID
router.post("/multiple", asyncHandler(newMultipleTeachers)); // Tạo mới hàng loạt Teachers

module.exports = router;
