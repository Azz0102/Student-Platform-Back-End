"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("grade", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            type: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            classSessionId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "class_sessions", // Assuming 'class_session' table exists
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "users", // Assuming 'users' table exists
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            value: {
                type: Sequelize.DOUBLE,
                allowNull: true,
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
        await queryInterface.dropTable("grade");
    },
};
