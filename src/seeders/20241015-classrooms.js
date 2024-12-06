"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const amphitheaterIds = [1, 2]; // Giả sử có các `amphitheaterId` là 1 và 2

        // Dữ liệu classrooms theo yêu cầu
        const classrooms = [
            { name: "Classroom A", capacity: 30, type: "Theory" },
            { name: "Classroom B", capacity: 25, type: "Theory" },
            { name: "Classroom C", capacity: 20, type: "Theory" },
            { name: "Classroom D", capacity: 35, type: "Theory" },
            { name: "Classroom E", capacity: 40, type: "Theory" },
            { name: "Classroom F", capacity: 45, type: "Theory" },
            { name: "Classroom G", capacity: 50, type: "Theory" },
            { name: "Classroom H", capacity: 55, type: "Theory" },
            { name: "Classroom I", capacity: 60, type: "Theory" },
            { name: "Classroom J", capacity: 65, type: "Theory" },
            { name: "Classroom K", capacity: 30, type: "Theory" },
            { name: "Classroom L", capacity: 35, type: "Theory" },
            { name: "Classroom M", capacity: 40, type: "Theory" },
            { name: "Classroom N", capacity: 45, type: "Theory" },
            { name: "Classroom O", capacity: 50, type: "Theory" },
            { name: "Classroom P", capacity: 55, type: "Theory" },
            { name: "Classroom Q", capacity: 60, type: "Theory" },
            { name: "Classroom R", capacity: 65, type: "Theory" },
            { name: "Classroom S", capacity: 70, type: "Theory" },
            { name: "Classroom T", capacity: 75, type: "Theory" },
            { name: "Classroom U", capacity: 20, type: "Practice" },
            { name: "Classroom V", capacity: 25, type: "Practice" },
            { name: "Classroom W", capacity: 30, type: "Practice" },
            { name: "Classroom X", capacity: 35, type: "Practice" },
            { name: "Classroom Y", capacity: 40, type: "Practice" },
            { name: "Classroom Z", capacity: 45, type: "Practice" },
            { name: "Classroom AA", capacity: 50, type: "Practice" },
            { name: "Classroom AB", capacity: 55, type: "Practice" },
            { name: "Classroom AC", capacity: 60, type: "Practice" },
            { name: "Classroom AD", capacity: 65, type: "Practice" },
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
