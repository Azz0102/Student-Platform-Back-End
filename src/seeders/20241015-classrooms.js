"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const amphitheaterIds = [1, 2]; // Giả sử có các `amphitheaterId` là 1 và 2

        await queryInterface.bulkInsert("classrooms", [
            {
                amphitheaterId: amphitheaterIds[0],
                name: "Room A101",
                capacity: 30,
                type: "Practice",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[1],
                name: "Room B201",
                capacity: 25,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[0],
                name: "Room A102",
                capacity: 25,
                type: "Practice",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[1],
                name: "Room B202",
                capacity: 35,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[0],
                name: "Room A103",
                capacity: 40,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[1],
                name: "Room B203",
                capacity: 50,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[0],
                name: "Room A104",
                capacity: 25,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[1],
                name: "Room B204",
                capacity: 20,
                type: "Practice",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("classrooms", null, {});
    },
};
