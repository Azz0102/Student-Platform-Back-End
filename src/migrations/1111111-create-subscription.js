"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("subscriptions", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            keyStoreId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "keystores",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            endpoint: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            expirationTime: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },
            auth: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            p256dh: {
                type: Sequelize.STRING,
                allowNull: false,
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
        await queryInterface.dropTable("subscriptions");
    },
};
