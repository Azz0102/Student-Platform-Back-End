"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("teacher_sessions", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
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
            session_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "session_details",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            // Define unique constraint
            unique_constraint: {
                type: Sequelize.STRING,
                unique: true,
                defaultValue: "teacher_sessions_unique_constraint",
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("teacher_sessions");
    },
};
