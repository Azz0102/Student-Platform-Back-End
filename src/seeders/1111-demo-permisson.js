"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("permissions", [
            {
                name: "create:any",
                slug: "create:any",
                description: "create any thing",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "read:any",
                slug: "read:any",
                description: "read any thing",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "update:any",
                slug: "update:any",
                description: "update any thing",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "delete:any",
                slug: "delete:any",
                description: "delete any thing",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "create:own",
                slug: "create:own",
                description: "create own",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "read:own",
                slug: "read:own",
                description: "read own",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "update:own",
                slug: "update:own",
                description: "update own",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "delete:own",
                slug: "delete:own",
                description: "delete own",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("permissions", null, {});
    },
};
