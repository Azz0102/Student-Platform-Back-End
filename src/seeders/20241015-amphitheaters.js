"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("amphitheaters", [
            {
                name: "Amphitheater A",
                location: "Main Building",
                latitude: 10.762622,
                longitude: 106.660172,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Amphitheater B",
                location: "Science Block",
                latitude: 10.762500,
                longitude: 106.662000,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("amphitheaters", null, {});
    },
};
