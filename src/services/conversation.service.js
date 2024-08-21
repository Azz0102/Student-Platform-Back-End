"use strict";

const db = require("../models");
const dayjs = require("dayjs");

const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");

// Create a new conversation
exports.createConversation = async ({ subjectId }) => {
  try {
    const conversation = await db.Conversation.create({
      subjectId,
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
    const participant = await db.Participant.findOne({
      where: {
        userId,
      },
    });

    if (!participant) {
      throw new NotFoundError("Participant not found");
    }

    const conversationParticipants = await db.ConversationParticipants.findAll({
      where: {
        participantId: participant.participantId,
      },
    });

    if (conversationParticipants.length === 0) {
      throw new NotFoundError("No conversations found for the participant.");
    }

    const conversations = await Promise.all(
      conversationParticipants.map(async (participant) => {
        const conversation = await exports.getConversationById({
          conversationId: participant.conversationId,
        });
        return conversation;
      })
    );

    return conversations;
  } catch (error) {
    return error;
  }
};

// Update a conversation by ID
exports.updateConversation = async (conversationId) => {
  try {
    const [affectedRows] = await db.Conversation.update(
      { updatedAt: dayjs().toISOString() },
      {
        where: { conversationId }, // Điều kiện để cập nhật bản ghi
        returning: true, // Trả về bản ghi đã được cập nhật
      }
    );

    // Kiểm tra nếu có bản ghi được cập nhật
    if (affectedRows === 0) {
      throw new NotFoundError("Conversation not found");
    }

    const updatedConversation = await db.Conversation.findByPk(conversationId);

    if (!updatedConversation) {
      throw new NotFoundError("Conversation not found");
    }

    return updatedConversation;
  } catch (error) {
    return error;
  }
}

// Delete a conversation by ID
exports.deleteConversation = async ({ conversationId }) => {
  try {
    // Xóa bản ghi dựa trên conversationId là duy nhất
    const affectedRows = await db.Conversation.destroy({
      where: {
        conversationId
      }
    });

    if (affectedRows === 0) {
      // Không tìm thấy bản ghi để xóa
      throw new NotFoundError("Conversation not found");
    }

    // Trả về phản hồi thành công
    return;
  } catch (error) {
    return error;
  }
};
