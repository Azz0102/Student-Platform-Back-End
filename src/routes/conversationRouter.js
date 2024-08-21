"use strict";

const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversation.controller");

router.post("/list", conversationController.getConversationByUserid);
router.get("/:id", conversationController.getConversationById);
router.post("/create", conversationController.createConversation);

module.exports = router;