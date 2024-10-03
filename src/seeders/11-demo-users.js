"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            "users",
            [
                {
                    roleId: 1, // Đảm bảo giá trị này tồn tại trong bảng 'roles'
                    name: "admin",
                    passwordHash: "hashed_password",
                    lastLogin: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("users", null, {});
    },
};
