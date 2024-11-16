"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            "users",
            [
                {
                    roleId: 1, // Đảm bảo giá trị này tồn tại trong bảng 'roles'
                    name: "20020645",
                    passwordHash: "$2b$10$dcWs5yJWJ2x6jY9ENKgTdO7hK5sy5.uJncq2TWfeXz4nkUT8otjQS",
                    lastLogin: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roleId: 2, // Đảm bảo giá trị này tồn tại trong bảng 'roles'
                    name: "20020646",
                    passwordHash: "$2b$10$3yYuj0iS8KXGCOdCUTZnfen34VQKxoOCbVJG6uWamXe/8lqOIYgrW",
                    lastLogin: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roleId: 2, // Đảm bảo giá trị này tồn tại trong bảng 'roles'
                    name: "20020647",
                    passwordHash: "$2b$10$ulGECBk1GumifFi9GIpTg.YKYMqCU39QJy2ao5.mKv4/ArfrsWv9W",
                    lastLogin: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roleId: 2, // Đảm bảo giá trị này tồn tại trong bảng 'roles'
                    name: "20020648",
                    passwordHash: "$2b$10$gJ.LXAA23WmFL9C/5OP49OT0ynN1drHfaxZovT.39lDvyjCUyk7Lm",
                    lastLogin: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("users", null, {});
    },
};
