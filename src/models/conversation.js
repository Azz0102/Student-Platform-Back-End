"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        static associate(models) {
            // 1 Conversation belongs to 1 Subject
            Conversation.belongsTo(models.Subject, { foreignKey: "subjectId" });

            // 1 Conversation can have many Messages
            Conversation.hasMany(models.Message, {
                foreignKey: "conversationId",
                onDelete: 'CASCADE',
            });

            // Many-to-Many relationship with Participant
            Conversation.belongsToMany(models.Participant, {
                through: "ConversationParticipants", // Tên bảng trung gian
                foreignKey: "conversationId",
                otherKey: "participantId",
                onDelete: 'CASCADE',
            });
        }
    }

    Conversation.init(
        {
            conversationId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            subjectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "subjects",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            modelName: "Conversation",
            tableName: "conversations",
            timestamps: false,
        }
    );

    return Conversation;
};
