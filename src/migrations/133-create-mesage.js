"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("messages", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            enrollmentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "enrollments", // Tên bảng `users` đã tồn tại trong cơ sở dữ liệu
                    key: "id",
                },
                onDelete: "CASCADE", // Xóa message khi user bị xóa
                onUpdate: "CASCADE",
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            file: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
