const express = require("express");
const router = express.Router();
const {
    newAmphitheater,
    amphitheaterList,
    amphitheaterDelete,
    amphitheaterUpdate,
    newMultipleAmphitheaters,
} = require("../controllers/amphitheater.controller");

router.post("/", newAmphitheater); // Tạo mới amphitheater
router.get("/", amphitheaterList); // Liệt kê amphitheaters
router.delete("/:id", amphitheaterDelete); // Xóa amphitheater
router.put("/:id", amphitheaterUpdate); // Cập nhật amphitheater
router.post("/bulk", newMultipleAmphitheaters); // Tạo mới hàng loạt amphitheaters

module.exports = router;
