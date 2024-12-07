"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const teachers = [
            "TS.Lê Đình Thanh",
            "TS.Nguyễn Văn Quang",
            "TS.Nguyễn Kiêm Hùng",
            "ThS.Đặng Anh Việt",
            "ThS.Phan Hoàng Anh",
            "KS.Phạm Đình Nguyện",
            "ThS.Nguyễn Thu Hằng",
            "TS.Hoàng Thị Điệp",
            "TS.Nguyễn Xuân Dương",
            "TS.Nguyễn Hồng Thịnh",
            "ThS.Đào Minh Thư",
            "ThS.Trần Mạnh Cường",
            "TS.Mai Linh",
            "ThS.Hoàng Ngọc Quý",
            "TS.Lê Việt Cường",
            "ThS.Nguyễn Cao Sơn",
            "TS.Lê Đình Thanh",
            "TS.Nguyễn Bích Vân",
            "CN.Nguyễn Hải Long",
            "TS.Phạm Đức Hạnh",
            "ThS.Vũ Minh Anh",
            "TS.Lê Đình Thanh",
            "TS.Lê Vũ Hà",
            "TS.Đỗ Nam",
            "ThS.Đỗ Ngọc Minh",
            "TS.Dương Lê Minh",
            "ThS.Trương Tuấn Anh"
        ];

        const teacherData = teachers.map((name, index) => ({
            name,
            email: `${name.replace(/\s+/g, '.').toLowerCase()}@university.edu`,
            dateOfBirth: new Date(`1980-${(index % 12) + 1}-15`),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        await queryInterface.bulkInsert("teachers", teacherData);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("teachers", null, {});
    },
};
