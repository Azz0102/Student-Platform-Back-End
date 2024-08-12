"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("classrooms", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            amphitheaterId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "amphitheaters", // The table name of the referenced model
                    key: "id",
                },
                onDelete: "CASCADE", // Optional: If an amphitheater is deleted, all associated classrooms will be deleted
            },
            name: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("classrooms");
    },
};
