"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("notification", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            noti_type: {
                type: Sequelize.STRING(20),
                allowNull: false,
                validate: {
                    isIn: [["NEWS-001", "TIME-001"]], // Possible values
                },
                comment: "Possible values: NEWS-001, TIME-001",
            },
            noti_sender_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: "0 is time noti",
                references: {
                    model: "news", // Assuming 'news' table exists
                    key: "id",
                },
            },
            noti_content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            noti_options: {
                type: Sequelize.JSON,
                defaultValue: {},
            },
            isRead: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
            // Add indexes for better query performance
            index_noti_type: {
                type: Sequelize.INTEGER,
                fields: ["noti_type"],
            },
            index_noti_sender_id: {
                type: Sequelize.INTEGER,
                fields: ["noti_sender_id"],
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("notification");
    },
};
