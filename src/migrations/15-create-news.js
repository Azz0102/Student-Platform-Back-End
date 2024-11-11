"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("news", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment: "Content is in Markdown format",
            },
            isGeneralSchoolNews: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            time: {
                // Thêm trường mới: thời gian
                type: Sequelize.DATE,
                allowNull: true, // Có thể cho phép null
            },
            location: {
                // Thêm trường mới: địa điểm
                type: Sequelize.TEXT,
                allowNull: true, // Có thể cho phép null
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
            type: {
                type: Sequelize.ENUM("EXAM-001", "EVENT-002", "ASSIGNMENT-003"),
                allowNull: false,
                defaultValue: "EVENT-002",
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("news");
    },
};
