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
            {
                name: "Emily Davis",
                email: "emily.davis@university.edu",
                dateOfBirth: new Date("1988-11-10"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Robert Johnson",
                email: "robert.johnson@university.edu",
                dateOfBirth: new Date("1975-05-25"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Laura Wilson",
                email: "laura.wilson@university.edu",
                dateOfBirth: new Date("1992-09-12"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Daniel Martinez",
                email: "daniel.martinez@university.edu",
                dateOfBirth: new Date("1982-02-08"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Sophia Garcia",
                email: "sophia.garcia@university.edu",
                dateOfBirth: new Date("1986-12-20"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "William Lee",
                email: "william.lee@university.edu",
                dateOfBirth: new Date("1995-04-14"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Olivia Taylor",
                email: "olivia.taylor@university.edu",
                dateOfBirth: new Date("1993-08-05"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("teachers", null, {});
    },
};
