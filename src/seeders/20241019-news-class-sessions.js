'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Thêm dữ liệu vào bảng news_class_sessions
        return queryInterface.bulkInsert('news_class_sessions', [
            {
                newsId: 1,
                classSessionId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                newsId: 1,
                classSessionId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                newsId: 2,
                classSessionId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                newsId: 2,
                classSessionId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                newsId: 3,
                classSessionId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                newsId: 3,
                classSessionId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        // Xóa dữ liệu khỏi bảng news_class_sessions
        return queryInterface.bulkDelete('news_class_sessions', null, {});
    }
};
