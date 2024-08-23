"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("noti_user", {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // Assuming 'users' table exists
                    key: "id",
                },
                onDelete: "CASCADE", // Optional: If a user is deleted, their notifications are also deleted
            },
            noti_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "notification", // Assuming 'notification' table exists
                    key: "id",
                },
                onDelete: "CASCADE", // Optional: If a notification is deleted, the relation is also deleted
            },
            isRead: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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

        // Create a unique index to prevent duplicates
        await queryInterface.addIndex("noti_user", ["user_id", "noti_id"], {
            unique: true,
            name: "unique_noti_user",
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("noti_user");
    },
};
