"use strict";

const express = require("express");
const router = express.Router();
const { authenticationV2 } = require("../auth/authUtils");
const chatController = require("../controllers/message.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

// router.use(authenticationV2);

router.post("/list", asyncHandler(chatController.getChatByConversationId));
router.get("/:id", asyncHandler(chatController.getChatById));
router.post("/create", asyncHandler(chatController.createChat));
router.delete("/:id", asyncHandler(chatController.deleteChat));
router.get("/chat/:userId", asyncHandler(chatController.getUserData));

router.get("/file/:id", asyncHandler(chatController.dowloadFile));


module.exports = router;
