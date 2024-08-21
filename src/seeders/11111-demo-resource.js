"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("resources", [
            {
                name: "user",
                slug: "User",
                description: "User resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "news",
                slug: "News",
                description: "News resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "notification",
                slug: "Notification",
                description: "Notification resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "classroom",
                slug: "Classroom",
                description: "Classroom resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "subject",
                slug: "Subject",
                description: "Subject resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "classSession",
                slug: "ClassSession",
                description: "ClassSession resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "finalExam",
                slug: "FinalExam",
                description: "FinalExam resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "amphitheater",
                slug: "Amphitheater",
                description: "Amphitheater resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "teacher",
                slug: "Teacher",
                description: "Teacher resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "userNote",
                slug: "UserNote",
                description: "UserNote resource",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("resources", null, {});
    },
};
