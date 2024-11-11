"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("grade", [
            {
                type: "10",
                classSessionId: 2,
                name: "Thành phần",
                userId: 3,
                value: 8.5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                type: "30",
                classSessionId: 2,
                name: "Giữa kỳ",
                userId: 3,
                value: 9.0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                type: "60",
                classSessionId: 2,
                name: "Cuối kỳ",
                userId: 3,
                value: 7.5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("grade", null, {});
    },
};
