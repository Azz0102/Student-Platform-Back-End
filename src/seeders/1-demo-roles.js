"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("roles", [
            {
                title: "Admin",
                slug: "admin",
                description: "Administrator with full access",
                active: true,
                content: "Admin content goes here",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: "User",
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
