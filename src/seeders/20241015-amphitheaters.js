"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("amphitheaters", [
            {
                name: "G2",
                location: "144 Xuân Thuỷ",
                latitude: 10.762622,
                longitude: 106.660172,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "GĐ2",
                location: "144 Xuân Thuỷ",
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
