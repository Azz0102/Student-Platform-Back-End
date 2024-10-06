const express = require("express");
const {
    newSessionDetail,
    sessionDetailList,
    sessionDetailDelete,
    sessionDetailUpdate,
    newMultipleSessionDetails,
} = require("../controllers/sessionDetails.controller");

const router = express.Router();

router.post("/", newSessionDetail); // Tạo mới SessionDetail
router.get("/", sessionDetailList); // Liệt kê tất cả SessionDetails
router.delete("/:id", sessionDetailDelete); // Xóa một SessionDetail theo ID
router.put("/:id", sessionDetailUpdate); // Cập nhật SessionDetail theo ID
router.post("/multiple", newMultipleSessionDetails); // Tạo mới hàng loạt SessionDetails

module.exports = router;
