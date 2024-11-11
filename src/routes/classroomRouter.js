"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const classroomController = require("../controllers/classroom.controller");

router.post("/", asyncHandler(classroomController.newClassroom)); // Tạo mới một classroom
router.get("/", asyncHandler(classroomController.classroomList)); // Liệt kê tất cả classrooms
router.delete("/:id", asyncHandler(classroomController.classroomDelete)); // Xóa một classroom
router.put("/:id", asyncHandler(classroomController.classroomUpdate)); // Cập nhật classroom
router.post("/bulk", asyncHandler(classroomController.newClassroomsBulk)); // Tạo mới hàng loạt classrooms

module.exports = router;
