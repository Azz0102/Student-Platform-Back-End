const express = require("express");
const {
    newTeacher,
    teacherList,
    teacherDelete,
    teacherUpdate,
    newMultipleTeachers,
} = require("../controllers/teacher.controller");

const router = express.Router();

router.post("/", newTeacher); // Tạo mới Teacher
router.get("/", teacherList); // Liệt kê tất cả Teachers
router.delete("/:id", teacherDelete); // Xóa một Teacher theo ID
router.put("/:id", teacherUpdate); // Cập nhật Teacher theo ID
router.post("/multiple", newMultipleTeachers); // Tạo mới hàng loạt Teachers

module.exports = router;
