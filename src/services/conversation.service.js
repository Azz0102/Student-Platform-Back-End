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

exports.getUserConversations = async ({ userId }) => {
  console.log(userId);
  try {
    // Get user and their enrolled class sessions
    const user = await db.User.findByPk(userId, {
      include: [{
        model: db.ClassSession,
        through: db.Enrollment,
        as: 'enrolledSessions'
      }]
    });
    console(user);
    if (!user) {
      throw new Error('User not found');
    }

    // Get conversations for the user's class sessions
    const conversations = await db.Conversation.findAll({
      where: {
        classSessionId: user.enrolledSessions.map(session => session.id)
      },
      include: [{
        model: db.Message,
        include: [{
          model: db.User,
          attributes: ['id', 'name']
        }]
      }]
    });

    return {
      user: {
        id: user.id,
        name: user.name
      },
      enrolledSessions: user.enrolledSessions,
      conversations: conversations.map(conversation => ({
        id: conversation.conversationId,
        classSessionId: conversation.classSessionId,
        messages: conversation.Messages.map(message => ({
          id: message.messageId,
          content: message.message,
          timestamp: message.timestamp,
          user: message.User
        }))
      }))
    };
  } catch (error) {
    return error;
  }
};
