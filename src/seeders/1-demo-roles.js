"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("roles", [
            {
                name: "admin",
                slug: "admin",
                description: "Administrator with full access",
                active: true,
                content: "Admin content goes here",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "user",
                slug: "user",
                description: "Regular user with limited access",
                active: true,
                content: "User content goes here",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("roles", null, {});
    },
};
