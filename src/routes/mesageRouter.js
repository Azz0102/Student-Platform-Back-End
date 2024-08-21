"use strict";

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/mesage.controller");

router.post("/list", chatController.getChatByConversationId);
router.get("/:id", chatController.getChatById);
router.post("/create", chatController.createChat);
router.delete("/:id", chatController.deleteChat);
module.exports = router;