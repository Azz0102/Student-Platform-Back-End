"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ConversationParticipants extends Model { }

    ConversationParticipants.init(
        {
            conversationId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "conversations",
                    key: "conversationId",
                },
            },
            participantId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "participants",
                    key: "participantId",
                },
            },
        },
        {
            sequelize,
            modelName: "ConversationParticipants",
            tableName: "conversation_participants",
            timestamps: false,
        }
    );

    return ConversationParticipants;
};
