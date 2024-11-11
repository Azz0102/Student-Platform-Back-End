"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {

            // 1 Message belongs to 1 User
            Message.belongsTo(models.Enrollment, { foreignKey: "enrollmentId" });
        }
    }

    Message.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            enrollmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "enrollments",
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
            file: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
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
