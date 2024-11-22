"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Seed data
        const userSessionDetailsData = [
            {
                enrollmentId: 1,
                sessionDetailsId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                enrollmentId: 2,
                sessionDetailsId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                enrollmentId: 3,
                sessionDetailsId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                enrollmentId: 4,
                sessionDetailsId: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                enrollmentId: 5,
                sessionDetailsId: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                enrollmentId: 6,
                sessionDetailsId: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                enrollmentId: 5,
                sessionDetailsId: 6,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                enrollmentId: 6,
                sessionDetailsId: 7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                enrollmentId: 4,
                sessionDetailsId: 8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                enrollmentId: 4,
                sessionDetailsId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert(
            "user_session_details",
            userSessionDetailsData,
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        // Remove all seeded data
        await queryInterface.bulkDelete("user_session_details", null, {});
    },
};
