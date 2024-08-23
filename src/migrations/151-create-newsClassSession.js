"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("news_class_sessions", {
            news_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "news",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            class_session_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "class_sessions",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
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
            // Define composite unique constraint
            unique_constraint: {
                type: Sequelize.STRING,
                unique: true,
                defaultValue: "news_class_sessions_unique_constraint",
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("news_class_sessions");
    },
};
