"use strict";

const express = require("express");
const router = express.Router();
const classSessionController = require("../controllers/classSession.controller");

router.post("/", classSessionController.newClassSession); // Tạo mới một ClassSession
router.get("/", classSessionController.classSessionList); // Liệt kê tất cả ClassSessions
router.delete("/:id", classSessionController.classSessionDelete); // Xóa một ClassSession
router.put("/:id", classSessionController.classSessionUpdate); // Cập nhật ClassSession
router.post("/bulk", classSessionController.newClassSessionsBulk); // Tạo mới hàng loạt ClassSessions

module.exports = router;
