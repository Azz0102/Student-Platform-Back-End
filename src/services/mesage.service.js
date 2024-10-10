"use strict";

const db = require("../models");
const { updateConversation } = require("./conversation.service");

const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");
const { where } = require("sequelize");

// Create (Insert) a new chat
exports.createChat = async ({ enrollmentId, message, timestamp, file = false }) => {
  try {
    const chat = await db.Message.create({
      enrollmentId,
      message,
      timestamp,
      file
    });
    return chat;
  } catch (error) {
    return error;
  }
};


// Delete a chat by ID
exports.deleteChat = async ({ id }) => {
  try {
    const deletedChat = await db.Message.destroy({
      where: { id },
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
          attributes: ['id', 'name', 'subjectId', 'semesterId', 'capacity'],
          include: [

          ]
        },
        {
          model: db.Message,
          attributes: ['id', 'message', 'timestamp'],
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
          id: message.id,
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
