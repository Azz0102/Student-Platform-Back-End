const express = require("express");
const router = express.Router();
const {
    newAmphitheater,
    amphitheaterList,
    amphitheaterDelete,
    amphitheaterUpdate,
    newMultipleAmphitheaters,
} = require("../controllers/amphitheater.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

router.post("/", asyncHandler(newAmphitheater)); // Tạo mới amphitheater
router.get("/", asyncHandler(amphitheaterList)); // Liệt kê amphitheaters
router.delete("/:id", asyncHandler(amphitheaterDelete)); // Xóa amphitheater
router.put("/:id", asyncHandler(amphitheaterUpdate)); // Cập nhật amphitheater
router.post("/bulk", asyncHandler(newMultipleAmphitheaters)); // Tạo mới hàng loạt amphitheaters

module.exports = router;
