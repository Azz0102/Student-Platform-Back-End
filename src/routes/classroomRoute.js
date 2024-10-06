"use strict";

const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroom.controller");

router.post("/", classroomController.newClassroom); // Tạo mới một classroom
router.get("/", classroomController.classroomList); // Liệt kê tất cả classrooms
router.delete("/:id", classroomController.classroomDelete); // Xóa một classroom
router.put("/:id", classroomController.classroomUpdate); // Cập nhật classroom
router.post("/bulk", classroomController.newClassroomsBulk); // Tạo mới hàng loạt classrooms

module.exports = router;
