
"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false,
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "roles", // Tên bảng role mà `roleId` tham chiếu đến
                    key: "id",
                },
            },
            name: {
                type: Sequelize.STRING(150),
                allowNull: true,
            },
            passwordHash: {
                type: Sequelize.STRING(60),
                allowNull: false,
            },
            lastLogin: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null,
            },
            reset_token: {
                type: Sequelize.STRING(100), // Kiểu dữ liệu của cột
                allowNull: true,              // Có thể null
                defaultValue: null,           // Giá trị mặc định là null
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("users");
    },
};
