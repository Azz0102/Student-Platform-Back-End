"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const amphitheaterIds = [1, 5]; // Giả sử có các `amphitheaterId` là 1 và 2

        // Dữ liệu classrooms theo yêu cầu
        const classrooms = [
            { name: "101", capacity: 30, type: "Theory" },
            { name: "102", capacity: 25, type: "Theory" },
            { name: "103", capacity: 20, type: "Theory" },
            { name: "104", capacity: 35, type: "Theory" },
            { name: "105", capacity: 40, type: "Theory" },
            { name: "106", capacity: 45, type: "Theory" },
            { name: "107", capacity: 50, type: "Theory" },
            { name: "108", capacity: 55, type: "Theory" },
            { name: "109", capacity: 60, type: "Theory" },
            { name: "110", capacity: 65, type: "Theory" },
            { name: "111", capacity: 30, type: "Theory" },
            { name: "201", capacity: 35, type: "Theory" },
            { name: "202", capacity: 40, type: "Theory" },
            { name: "203", capacity: 45, type: "Theory" },
            { name: "204", capacity: 50, type: "Theory" },
            { name: "205", capacity: 55, type: "Theory" },
            { name: "206", capacity: 60, type: "Theory" },
            { name: "207", capacity: 65, type: "Theory" },
            { name: "208", capacity: 70, type: "Theory" },
            { name: "209", capacity: 75, type: "Theory" },
            { name: "210", capacity: 20, type: "Practice" },
            { name: "211", capacity: 25, type: "Practice" },
            { name: "301", capacity: 30, type: "Practice" },
            { name: "302", capacity: 35, type: "Practice" },
            { name: "303", capacity: 40, type: "Practice" },
            { name: "304", capacity: 45, type: "Practice" },
            { name: "305", capacity: 50, type: "Practice" },
            { name: "306", capacity: 55, type: "Practice" },
            { name: "307", capacity: 60, type: "Practice" },
            { name: "308", capacity: 65, type: "Practice" }
        ];
        // Thêm `amphitheaterId`, `createdAt`, và `updatedAt` cho từng classroom
        const now = new Date();
        const dataToInsert = classrooms.map((classroom, index) => ({
            amphitheaterId: amphitheaterIds[index % amphitheaterIds.length], // Xen kẽ giữa amphitheaterId 1 và 2
            ...classroom,
            createdAt: now,
            updatedAt: now,
        }));

        await queryInterface.bulkInsert("classrooms", dataToInsert);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("classrooms", null, {});
    },
};
