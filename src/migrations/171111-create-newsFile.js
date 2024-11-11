"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("news_file", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            newsId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "news",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            fileId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "files",
                    key: "id",
                },
                onDelete: "CASCADE",
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
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                ),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("news_file");
    },
};
