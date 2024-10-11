"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Seeder cho user_notes
        await queryInterface.bulkInsert("user_notes", [
            {
                userId: 2,
                name: "First Note",
                content: "This is the content of the first note.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                name: "Second Note",
                content: "This is the content of the second note.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 4,
                name: "Third Note",
                content: "This is the content of the third note.",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        // Seeder cho tags
        await queryInterface.bulkInsert("tags", [
            {
                name: "Important",
                userId: 2,
                isPermanent: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Personal",
                userId: 3,
                isPermanent: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Work",
                userId: 4,
                isPermanent: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        // Seeder cho note_tags
        await queryInterface.bulkInsert("note_tags", [
            {
                noteId: 1, // Giả sử ID của UserNote đầu tiên là 1
                tagId: 1,  // Giả sử ID của Tag đầu tiên là 1
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                noteId: 2, // Giả sử ID của UserNote thứ hai là 2
                tagId: 2,  // Giả sử ID của Tag thứ hai là 2
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                noteId: 3, // Giả sử ID của UserNote thứ ba là 3
                tagId: 3,  // Giả sử ID của Tag thứ ba là 3
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("note_tags", null, {});
        await queryInterface.bulkDelete("tags", null, {});
        await queryInterface.bulkDelete("user_notes", null, {});
    },
};
