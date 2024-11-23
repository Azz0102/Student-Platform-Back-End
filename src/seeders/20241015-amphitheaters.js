"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("amphitheaters", [
            {
                name: "G2",
                location: "144, Xuân Thủy",
                latitude: 10.762622,
                longitude: 106.660172,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "GĐ2",
                location: "144, Xuân Thủy",
                latitude: 10.7625,
                longitude: 106.662,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "VCH",
                location: "144, Xuân Thủy",
                latitude: 10.7625,
                longitude: 106.662,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "G3",
                location: "144, Xuân Thủy",
                latitude: 10.7625,
                longitude: 106.662,
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            {
                name: "Sân bãi ĐHNN",
                location: "144, Xuân Thủy",
                latitude: 10.7625,
                longitude: 106.662,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "E3",
                location: "144, Xuân Thủy",
                latitude: 10.7625,
                longitude: 106.662,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "E5",
                location: "144, Xuân Thủy",
                latitude: 10.7625,
                longitude: 106.662,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "GĐ3",
                location: "8 Tôn Thất Thuyết, Mỹ Đình, Nam Từ Liêm, Hà Nội",
                latitude: 10.7625,
                longitude: 106.662,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("amphitheaters", null, {});
    },
};
