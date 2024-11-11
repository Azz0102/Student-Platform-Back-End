const express = require("express");
const {
    newSessionDetail,
    sessionDetailList,
    sessionDetailDelete,
    sessionDetailUpdate,
    newMultipleSessionDetails,
    getUserSessionDetails,
    getSessionDetailsByUserId,
    getUserClassSessionDetail
} = require("../controllers/sessionDetails.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(newSessionDetail)); // Tạo mới SessionDetail
router.get("/", asyncHandler(sessionDetailList)); // Liệt kê tất cả SessionDetails
router.delete("/:id", asyncHandler(sessionDetailDelete)); // Xóa một SessionDetail theo ID
router.put("/:id", asyncHandler(sessionDetailUpdate)); // Cập nhật SessionDetail theo ID
router.post("/multiple", asyncHandler(newMultipleSessionDetails)); // Tạo mới hàng loạt SessionDetails

router.get("/user", asyncHandler(getUserSessionDetails));

router.get("/user/:id", asyncHandler(getSessionDetailsByUserId));

router.get("/:id", asyncHandler(getUserClassSessionDetail));



module.exports = router;
