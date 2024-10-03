"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("messages", {
            messageId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            conversationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "conversations", // Tên bảng `conversations` đã tồn tại trong cơ sở dữ liệu
                    key: "conversationId",
                },
                onDelete: "CASCADE", // Xóa message khi conversation bị xóa
                onUpdate: "CASCADE",
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // Tên bảng `users` đã tồn tại trong cơ sở dữ liệu
                    key: "id",
                },
                onDelete: "CASCADE", // Xóa message khi user bị xóa
                onUpdate: "CASCADE",
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("messages");
    },
};
