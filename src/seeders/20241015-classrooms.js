"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const amphitheaterIds = [1, 2]; // Giả sử có các `amphitheaterId` là 1 và 2

        await queryInterface.bulkInsert("classrooms", [
            {
                amphitheaterId: amphitheaterIds[0],
                name: "Room A101",
                capacity: 30,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[1],
                name: "Room B201",
                capacity: 25,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("classrooms", null, {});
    },
};
