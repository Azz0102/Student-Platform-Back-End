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
                    isIn: [["NEWS-001", "CLASS-001"]], // Possible values
                },
                comment: "Possible values: NEWS-001, CLASS-001",
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
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("notification");
    },
};
