"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            // 1 Message belongs to 1 Conversation
            Message.belongsTo(models.Conversation, { foreignKey: "conversationId" });

            // 1 Message belongs to 1 User
            Message.belongsTo(models.User, { foreignKey: "userId", as: 'sender' });
        }
    }

    Message.init(
        {
            messageId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            conversationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "conversations",
                    key: "conversationId",
                },
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Message",
            tableName: "messages",
            timestamps: false,
        }
    );

    return Message;
};
