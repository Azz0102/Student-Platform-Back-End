"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("teachers", [
            {
                name: "John Doe",
                email: "john.doe@university.edu",
                dateOfBirth: new Date("1980-01-15"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Jane Smith",
                email: "jane.smith@university.edu",
                dateOfBirth: new Date("1985-03-22"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Michael Brown",
                email: "michael.brown@university.edu",
                dateOfBirth: new Date("1990-07-30"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("teachers", null, {});
    },
};
