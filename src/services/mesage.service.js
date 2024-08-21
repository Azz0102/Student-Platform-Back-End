"use strict";

const db = require("../models");
const { updateConversation } = require("./conversation.service");

const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");

// Create (Insert) a new chat
exports.createChat = async ({ conversationId, userId, message }) => {
  try {
    const chat = await db.Message.create({
      conversationId,
      userId,
      message
    });
    await updateConversation(conversationId);
    return chat;
  } catch (error) {
    return error;
  }
};

// Read (Retrieve) a chat by ID
exports.getChatById = async ({ messageId }) => {
  try {
    const chat = await db.Message.findByPk(messageId);
    if (!chat) {
      throw new NotFoundError("");
    }
    return chat;
  } catch (error) {
    return error;
  }
};

// Read (Retrieve) a chat by getChatByConversationId
exports.getChatByConversationId = async ({ conversationId }) => {
  try {
    const chats = await db.Message.findAll({
      where: { conversationId },
      order: [['timestamp', 'DESC']],
      include: [
        {
          model: db.User,
          attributes: ['name'],
        },
      ],
    });

    return chats;
  } catch (error) {
    return error;
  }
};


// Delete a chat by ID
exports.deleteChat = async ({ messageId }) => {
  try {
    const deletedChat = await db.Message.destroy({
      where: { messageId },
    });
    if (!deletedChat) {
      throw new NotFoundError("deleteChat");
    }
    return deletedChat;
  } catch (error) {
    return error;
  }
};