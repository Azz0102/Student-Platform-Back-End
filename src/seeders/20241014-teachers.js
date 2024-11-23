"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("teachers", [
            {
                name: "Bùi Trung Ninh",
                email: "ninhbt@vnu.edu.vn",
                dateOfBirth: new Date("1980-01-15"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Lâm Sinh Công",
                email: "congls@vnu.edu.vn",
                dateOfBirth: new Date("1985-03-22"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Đinh Thị Thái Mai",
                email: "dttmai@vnu.edu.vn",
                dateOfBirth: new Date("1990-07-30"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Phan Hoàng Anh",
                email: "emily.davis@university.edu",
                dateOfBirth: new Date("1988-11-10"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Nguyễn Thu Hằng",
                email: "robert.johnson@university.edu",
                dateOfBirth: new Date("1975-05-25"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Phạm Duy Hưng",
                email: "laura.wilson@university.edu",
                dateOfBirth: new Date("1992-09-12"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Trần Thị Thúy Quỳnh",
                email: "daniel.martinez@university.edu",
                dateOfBirth: new Date("1982-02-08"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Nguyễn Linh Trung",
                email: "sophia.garcia@university.edu",
                dateOfBirth: new Date("1986-12-20"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Phạm Đình Tuân",
                email: "william.lee@university.edu",
                dateOfBirth: new Date("1995-04-14"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Trịnh Anh Vũ",
                email: "olivia.taylor@university.edu",
                dateOfBirth: new Date("1993-08-05"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("teachers", null, {});
    },
};
