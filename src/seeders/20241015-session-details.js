"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const classSessionIds = [1, 2]; // Ví dụ, giả sử `classSessionId` của "INT_2021" là 1 và "ENU_2020" là 2
        const classroomIds = [1, 2]; // Giả sử có các phòng học có id tương ứng là 1 và 2
        const teacherIds = [1, 2]; // Giả sử các giáo viên có `teacherId` là 1 và 2

        await queryInterface.bulkInsert("session_details", [
            {
                classSessionId: classSessionIds[0],
                classroomId: classroomIds[0],
                startTime: new Date("2024-01-01 08:00:00"),
                numOfHour: 2,
                dayOfWeek: "Monday",
                sessionType: "Theory",
                capacity: 30,
                teacherId: teacherIds[0],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                classSessionId: classSessionIds[1],
                classroomId: classroomIds[1],
                startTime: new Date("2024-01-04 10:00:00"),
                numOfHour: 3,
                dayOfWeek: "Wednesday",
                sessionType: "Practice",
                capacity: 25,
                teacherId: teacherIds[1],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("session_details", null, {});
    },
};
