"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("conversations", {
            conversationId: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            classSessionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "class_sessions", // Tên bảng `class_sessions` đã tồn tại trong cơ sở dữ liệu
                    key: "id",
                },
                onDelete: "CASCADE", // Xóa conversation khi class session bị xóa
                onUpdate: "CASCADE",
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("conversations");
    },
};
