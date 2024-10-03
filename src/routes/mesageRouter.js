"use strict";

const express = require("express");
const router = express.Router();
const { authenticationV2 } = require("../auth/authUtils");
const chatController = require("../controllers/message.controller");

router.use(authenticationV2);

router.post("/list", chatController.getChatByConversationId);
router.get("/:id", chatController.getChatById);
router.post("/create", chatController.createChat);
router.delete("/:id", chatController.deleteChat);
module.exports = router;
