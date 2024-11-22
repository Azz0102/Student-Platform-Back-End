"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("enrollments", [
            {
                userId: 2,
                classSessionId: 1,
                enrolledAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                classSessionId: 1,
                enrolledAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                classSessionId: 2,
                enrolledAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                classSessionId: 3,
                enrolledAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                classSessionId: 4,
                enrolledAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                classSessionId: 5,
                enrolledAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 4,
                classSessionId: 2,
                enrolledAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("enrollments", null, {});
    },
};
