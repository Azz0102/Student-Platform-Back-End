'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles', // Tên bảng role mà `roleId` tham chiếu đến
                    key: 'id'
                }
            },
            name: {
                type: Sequelize.STRING(150),
                allowNull: true
            },
            passwordHash: {
                type: Sequelize.STRING(60),
                allowNull: false
            },
            lastLogin: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    }
};
