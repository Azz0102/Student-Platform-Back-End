"use strict";

const express = require("express");
const router = express.Router();
const { authenticationV2 } = require("../auth/authUtils");
const conversationController = require("../controllers/conversation.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

router.use(authenticationV2);

router.get(
    "/user/:userId",
    asyncHandler(conversationController.getConversationByUserid)
); // Lấy cuộc hội thoại theo UserId
router.get(
    "/:conversationId",
    asyncHandler(conversationController.getConversationById)
); // Lấy một cuộc hội thoại theo ID
router.post("/", asyncHandler(conversationController.createConversation)); // Tạo mới một cuộc hội thoại

module.exports = router;
