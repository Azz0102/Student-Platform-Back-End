"use strict";

const express = require("express");
const router = express.Router();
const { authenticationV2 } = require("../auth/authUtils");
const conversationController = require("../controllers/conversation.controller");

router.use(authenticationV2);

router.post("/list", conversationController.getConversationByUserid);
router.get("/:id", conversationController.getConversationById);
router.post("/create", conversationController.createConversation);

module.exports = router;
