"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("class_sessions", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            subjectId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "subjects",
                    key: "id",
                },
                onDelete: "CASCADE", // Nếu cần
            },
            semesterId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "semester",
                    key: "id",
                },
                onDelete: "CASCADE", // Nếu cần
            },
            fromDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            numOfSessionAWeek: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            capacity: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("class_sessions");
    },
};
