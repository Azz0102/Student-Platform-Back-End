"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("subjects", [
            {
                name: "Giải Tích 1",
                description: "Môn học về các khái niệm cơ bản trong toán học, bao gồm giới hạn, đạo hàm và tích phân.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Cơ Học",
                description: "Môn học nghiên cứu về các lực và chuyển động của vật thể.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Hóa Học Đại Cương",
                description: "Môn học giới thiệu các nguyên lý cơ bản về cấu trúc phân tử và các phản ứng hóa học.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Sinh Học Đại Cương",
                description: "Môn học nghiên cứu về các khái niệm cơ bản trong sinh học, bao gồm di truyền học, sinh lý học và sinh thái học.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Lịch Sử Thế Giới",
                description: "Môn học nghiên cứu về các sự kiện quan trọng trong lịch sử thế giới từ cổ đại đến hiện đại.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        );

        await queryInterface.bulkInsert("semester", [
            {
                name: "Học Kỳ I 2023-2024",
                fromDate: new Date("2024-01-01"),
                endDate: new Date("2024-05-31"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Học Kỳ II 2023-2024",
                fromDate: new Date("2024-06-01"),
                endDate: new Date("2024-12-31"),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
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
            subjectId: subjectIds[i % 4], // Mathematics
            semesterId: semesterIds[1], // Semester 2
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
        ].map((name, i) => ({
            name,
            subjectId: subjectIds[i % 4], // Physics
            semesterId: semesterIds[1], // Semester 2
            fromDate: new Date("2024-06-01"),
            endDate: new Date("2024-09-30"),
            numOfSessionAWeek: 1,
            capacity: 25,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const list = [
            "INT1001",
            "INT1002",
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
