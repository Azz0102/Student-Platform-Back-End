"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("amphitheaters", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },
            location: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            latitude: {
                type: Sequelize.DOUBLE,
                allowNull: false,
                comment: "Latitude for Google Maps location",
            },
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: false,
                comment: "Longitude for Google Maps location",
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
        await queryInterface.dropTable("amphitheaters");
    },
};
