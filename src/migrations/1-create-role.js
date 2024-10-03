"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.createTable("roles", {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING(75),
                    allowNull: false,
                },
                slug: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                description: {
                    type: Sequelize.STRING, // Thay thế TINYTEXT bằng STRING
                    allowNull: true,
                    defaultValue: null,
                },
                active: {
                    type: Sequelize.BOOLEAN, // Thay thế TINYINT(1) bằng BOOLEAN
                    allowNull: false,
                    defaultValue: false,
                },
                content: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
            });
        } catch (error) {
            console.error('Error creating table "roles":', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.dropTable("roles");
        } catch (error) {
            console.error('Error dropping table "roles":', error);
            throw error;
        }
    },
};
