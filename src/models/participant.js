"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Participant extends Model {
        static associate(models) {
            // 1 Participant belongs to 1 User
            Participant.belongsTo(models.User, { foreignKey: "userId" });

            // Many-to-Many relationship with Conversation
            Participant.belongsToMany(models.Conversation, {
                through: "ParticipantConversations", // Tên bảng trung gian
                foreignKey: "participantId",
                otherKey: "conversationId",
            });
        }
    }

    Participant.init(
        {
            participantId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            modelName: "Participant",
            tableName: "participants",
            timestamps: false,
        }
    );

    return Participant;
};
