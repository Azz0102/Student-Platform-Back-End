"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("subjects", [
            {
                name: "INT_2021",
                description: "Mathematics.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "ENU_2020",
                description: "Physics.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "UEH_2020",
                description: "Chemistry.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        await queryInterface.bulkInsert("semester", [
            {
                name: "Hoc Ky I Nam 2024",
                fromDate: new Date("2024-01-01"),
                endDate: new Date("2024-05-31"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Hoc Ky II Nam 2024",
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
                name: "INT_2021_1",
                subjectId: subjectIds[0], // Mathematics
                semesterId: semesterIds[0], // Semester 1
                fromDate: new Date("2024-01-01"),
                endDate: new Date("2024-04-30"),
                numOfSessionAWeek: 1,
                capacity: 30,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "ENU_2020_1",
                subjectId: subjectIds[1], // Physics
                semesterId: semesterIds[1], // Semester 2
                fromDate: new Date("2024-06-01"),
                endDate: new Date("2024-09-30"),
                numOfSessionAWeek: 1,
                capacity: 25,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        const classSessions = await queryInterface.sequelize.query(
            `SELECT id FROM class_sessions;`
        );

        const classSessionIds = classSessions[0].map((session) => session.id);

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("class_sessions", null, {});
        await queryInterface.bulkDelete("semester", null, {});
        await queryInterface.bulkDelete("subjects", null, {});
    },
};
