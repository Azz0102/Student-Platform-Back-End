"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        static associate(models) {
            // 1 Conversation belongs to 1 ClassSession
            Conversation.belongsTo(models.ClassSession, { foreignKey: "classSessionId", onDelete: 'CASCADE' });

            // 1 Conversation can have many Messages
            Conversation.hasMany(models.Message, {
                foreignKey: "conversationId",
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
            classSessionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "class_sessions",
                    key: "id",

                },
            },
        },
        {
            sequelize,
            modelName: "Conversation",
            tableName: "conversations",
            timestamps: true,
        }
    );

    return Conversation;
};
