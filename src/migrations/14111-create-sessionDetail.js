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
            classroom_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "classrooms",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            start_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            num_of_hour: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            day_of_week: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            session_type: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "Theory, Practice",
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            teacher_id: {
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
