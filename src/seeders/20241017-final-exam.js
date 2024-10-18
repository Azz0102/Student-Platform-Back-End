"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("final_exams", [
            {
                classSessionId: 2,
                examDate: new Date("2024-12-11T09:00:00"), // Ngày thi của classSession 2
                duration: 90, // 90 phút
                location: "Room B202",
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("final_exams", null, {});
    },
};
