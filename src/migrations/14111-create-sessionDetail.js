"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("session_details", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
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
            classroomId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "classrooms",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            startTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            numOfHour: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            dayOfWeek: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            sessionType: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "Theory, Practice",
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            teacherId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "teachers",
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
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("session_details");
    },
};
