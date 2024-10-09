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
exports.createChat = async ({ enrollmentId, message, timestamp }) => {
  try {
    const chat = await db.Message.create({
      enrollmentId,
      message,
      timestamp
    });
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

exports.getUserData = async ({ userId }) => {
  try {
    // Step 1: Get user
    const user = await db.User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Step 2: Get enrolled class sessions with messages
    const enrollments = await db.Enrollment.findAll({
      where: { userId: userId },
      include: [
        {
          model: db.ClassSession,
          attributes: ['id', 'name', 'subjectId', 'semesterId', 'capacity']
        },
        {
          model: db.Message,
          attributes: ['messageId', 'message', 'timestamp'],
          include: [
            {
              model: db.Enrollment,
              attributes: ['userId'],
              include: [
                {
                  model: db.User,
                  attributes: ['id', 'name']
                }
              ]
            }
          ]
        }
      ]
    });

    // Step 3: Structure the result
    return {
      user: {
        id: user.id,
        name: user.name
      },
      enrolledSessions: enrollments.map(enrollment => ({
        enrollment: {
          id: enrollment.id,
          enrolledAt: enrollment.enrolledAt
        },
        classSession: enrollment.ClassSession,
        messages: enrollment.Messages.map(message => ({
          id: message.messageId,
          content: message.message,
          timestamp: message.timestamp,
          user: message.Enrollment.User
        }))
      }))
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}