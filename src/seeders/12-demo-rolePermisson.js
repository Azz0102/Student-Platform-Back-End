"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("role_permission", [
            {
                roleId: 1,
                permissionId: 1,
                resourceId: 1,
                attributes: "*",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleId: 1,
                permissionId: 4,
                resourceId: 1,
                attributes: "*",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleId: 1,
                permissionId: 1,
                resourceId: 2,
                attributes: "*",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleId: 1,
                permissionId: 2,
                resourceId: 2,
                attributes: "*",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleId: 1,
                permissionId: 3,
                resourceId: 2,
                attributes: "*",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleId: 1,
                permissionId: 4,
                resourceId: 2,
                attributes: "*",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleId: 2,
                permissionId: 6,
                resourceId: 3,
                attributes: "*",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("role_permission", null, {});
    },
};
