"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("news_class_sessions", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false,
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
            classSessionId: {
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
        });

        // Thêm unique constraint cho cặp (newsId, classSessionId)
        await queryInterface.addConstraint("news_class_sessions", {
            fields: ["newsId", "classSessionId"],
            type: "unique",
            name: "news_class_sessions_unique_constraint", // Tên của unique constraint
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("news_class_sessions");
    },
};
