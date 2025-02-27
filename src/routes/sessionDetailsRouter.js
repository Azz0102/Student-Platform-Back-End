const express = require("express");
const {
    newSessionDetail,
    sessionDetailList,
    sessionDetailDelete,
    sessionDetailUpdate,
    newMultipleSessionDetails,
    getUserSessionDetails,
    getSessionDetailsByUserId,
    getUserClassSessionDetail,
    allSessionDetail,
    downSessionDetail
} = require("../controllers/sessionDetails.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(newSessionDetail)); // Tạo mới SessionDetail
router.get("/", asyncHandler(sessionDetailList)); // Liệt kê tất cả SessionDetails
router.get("/all/:semester", asyncHandler(allSessionDetail)); // Liệt kê tất cả SessionDetails all
router.get("/down/:semester", asyncHandler(downSessionDetail)); // Liệt kê tất cả SessionDetails all
router.delete("/", asyncHandler(sessionDetailDelete)); // Xóa một SessionDetail theo ID
router.put("/:id", asyncHandler(sessionDetailUpdate)); // Cập nhật SessionDetail theo ID

router.post("/multiple", asyncHandler(newMultipleSessionDetails)); // Tạo mới hàng loạt SessionDetails

router.get("/user", asyncHandler(getUserSessionDetails));

router.get("/user/:id", asyncHandler(getSessionDetailsByUserId));

router.get("/:id", asyncHandler(getUserClassSessionDetail));



module.exports = router;
