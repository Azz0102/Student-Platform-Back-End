"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("subjects", [
            {
                name: "Mathematics",
                description: "Study of numbers, shapes, and patterns.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Physics",
                description: "Study of matter, energy, and their interactions.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Chemistry",
                description: "Study of substances, their properties, and reactions.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        await queryInterface.bulkInsert("semester", [
            {
                fromDate: new Date("2024-01-01"),
                endDate: new Date("2024-05-31"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                fromDate: new Date("2024-06-01"),
                endDate: new Date("2024-12-31"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        const subjects = await queryInterface.sequelize.query(
            `SELECT id FROM subjects;`
        );
        const semesters = await queryInterface.sequelize.query(
            `SELECT id FROM semester;`
        );

        const subjectIds = subjects[0].map((subject) => subject.id);
        const semesterIds = semesters[0].map((semester) => semester.id);

        await queryInterface.bulkInsert("class_sessions", [
            {
                subjectId: subjectIds[0], // Mathematics
                semesterId: semesterIds[0], // Semester 1
                fromDate: new Date("2024-01-01"),
                endDate: new Date("2024-04-30"),
                numOfSessionAWeek: 3,
                capacity: 30,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                subjectId: subjectIds[1], // Physics
                semesterId: semesterIds[1], // Semester 2
                fromDate: new Date("2024-06-01"),
                endDate: new Date("2024-09-30"),
                numOfSessionAWeek: 2,
                capacity: 25,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        const classSessions = await queryInterface.sequelize.query(
            `SELECT id FROM class_sessions;`
        );

        const classSessionIds = classSessions[0].map((session) => session.id);

        await queryInterface.bulkInsert("conversations", [
            {
                classSessionId: classSessionIds[0], // First class session
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                classSessionId: classSessionIds[1], // Second class session
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("conversations", null, {});
        await queryInterface.bulkDelete("class_sessions", null, {});
        await queryInterface.bulkDelete("semester", null, {});
        await queryInterface.bulkDelete("subjects", null, {});
    },
};
