"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("KeyStores", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // Tên bảng mà bạn tham chiếu đến (chú ý chữ 'U' viết hoa)
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                field: "userId",
            },
            publicKey: {
                type: Sequelize.TEXT,
                allowNull: false,
                field: "publicKey",
            },
            privateKey: {
                type: Sequelize.TEXT,
                allowNull: false,
                field: "privateKey",
            },
            refreshToken: {
                type: Sequelize.TEXT,
                allowNull: false,
                field: "refreshToken",
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
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("KeyStores");
    },
};
