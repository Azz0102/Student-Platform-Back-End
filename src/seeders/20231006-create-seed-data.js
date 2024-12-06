"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("subjects", [
            {
                name: "INT",
                description: "Mathematics.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "FIXED",
                description: "Physics.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "UEH",
                description: "Chemistry.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "BIO_2021",
                description: "Biology.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "HIS_2020",
                description: "History.",
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
            {
                name: "Hoc Ky I Nam 2025",
                fromDate: new Date("2025-01-01"),
                endDate: new Date("2025-05-31"),
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

        // Tạo danh sách các lớp học (INT2001 - INT2080)
        const dynamicClassSessions = Array.from({ length: 80 }, (_, i) => ({
            name: `INT${2001 + i}`, // Tạo tên từ INT2001 đến INT2080
            subjectId: subjectIds[0], // Mathematics
            semesterId: semesterIds[1], // Semester 1
            fromDate: new Date("2024-01-01"),
            endDate: new Date("2024-04-30"),
            numOfSessionAWeek: 1,
            capacity: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        // Thêm các lớp học FIXED
        const fixedClassSessions = [
            "FIXED_TL1",
            "FIXED_TL2",
            "FIXED_L1",
            "FIXED_L2",
            "FIXED_T1",
            "FIXED_T2",
        ].map((name) => ({
            name,
            subjectId: subjectIds[1], // Physics
            semesterId: semesterIds[1], // Semester 2
            fromDate: new Date("2024-06-01"),
            endDate: new Date("2024-09-30"),
            numOfSessionAWeek: 1,
            capacity: 25,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const list = [
            "LIST",
            "LIST2",
        ].map((name) => ({
            name,
            subjectId: subjectIds[1], // Physics
            semesterId: semesterIds[0], // Semester 1
            fromDate: new Date("2024-06-01"),
            endDate: new Date("2024-09-30"),
            numOfSessionAWeek: 1,
            capacity: 25,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        // Gộp tất cả lớp học
        const allClassSessions = [...list, ...dynamicClassSessions, ...fixedClassSessions];

        // Chèn dữ liệu vào bảng class_sessions
        await queryInterface.bulkInsert("class_sessions", allClassSessions);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("class_sessions", null, {});
        await queryInterface.bulkDelete("semester", null, {});
        await queryInterface.bulkDelete("subjects", null, {});
    },
};
