"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const amphitheaterIds = [1, 2]; // Giả sử có các `amphitheaterId` là 1 và 2

        await queryInterface.bulkInsert("classrooms", [
            {
                amphitheaterId: amphitheaterIds[0],
                name: "101",
                capacity: 30,
                type: "Practice",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[1],
                name: "201",
                capacity: 25,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[0],
                name: "102",
                capacity: 25,
                type: "Practice",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[1],
                name: "202",
                capacity: 35,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[0],
                name: "303",
                capacity: 40,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[1],
                name: "210",
                capacity: 50,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[0],
                name: "302",
                capacity: 25,
                type: "Theory",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                amphitheaterId: amphitheaterIds[1],
                name: "208",
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
