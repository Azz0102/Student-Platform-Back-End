"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("note_tags", {
            noteId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "user_notes",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            tagId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "tags",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
        });

        // Thêm ràng buộc duy nhất cho các cột noteId và tagId
        await queryInterface.addConstraint("note_tags", {
            fields: ["noteId", "tagId"],
            type: "unique",
            name: "unique_note_tag" // Tên của ràng buộc duy nhất
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("note_tags");
    },
};
