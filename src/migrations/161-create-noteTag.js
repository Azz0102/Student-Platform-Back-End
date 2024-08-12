"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("note_tags", {
            note_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "user_notes",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            tag_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "tags",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            // Add unique constraint to prevent duplicate entries
            unique_constraint: {
                type: Sequelize.INTEGER,
                unique: true,
                fields: ["note_id", "tag_id"],
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("note_tags");
    },
};
