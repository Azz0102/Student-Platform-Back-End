"use strict";

const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subject.controller");

router.post("/", subjectController.newSubject); // Tạo mới một subject
router.get("/", subjectController.subjectList); // Liệt kê tất cả subjects
router.delete("/:id", subjectController.subjectDelete); // Xóa một subject
router.put("/:id", subjectController.subjectUpdate); // Cập nhật subject
router.post("/bulk", subjectController.newSubjectsBulk); // Tạo mới hàng loạt subjects

module.exports = router;
