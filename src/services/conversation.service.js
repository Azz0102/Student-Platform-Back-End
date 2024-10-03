"use strict";

const db = require("../models");

const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");

// Create a new conversation
exports.createConversation = async ({ classSessionId }) => {
  try {
    const conversation = await db.Conversation.create({
      classSessionId,
    });

    if (!conversation) {
      throw new NotFoundError("");
    }
    return conversation;
  } catch (error) {
    return error;
  }
};

// Read (Retrieve) a conversation by ID
exports.getConversationById = async ({ conversationId }) => {
  try {
    const conversation = await db.Conversation.findByPk(conversationId);
    if (!conversation) {
      throw new NotFoundError("Not found Conversation");
    }
    return conversation;
  } catch (error) {
    return error;
  }
};

// Read (Retrieve) a conversation by UserId
exports.getConversationByUserid = async ({ userId }) => {
  try {

    const conversations = await db.Enrollment.findAll({
      where: {
        userId
      },
      include: [
        {
          model: db.ClassSession,
          attributes: ['id'],
          include: [
            {
              model: db.Subject, // Lồng ghép thêm Course
              attributes: ['name', 'description'] // Chọn các thuộc tính của Course
            }
          ]
        },
      ],

    });

    return conversations;
  } catch (error) {
    return error;
  }
};
