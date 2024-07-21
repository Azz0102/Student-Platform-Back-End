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
            userName: {
                type: Sequelize.STRING(150),
                allowNull: true
            },
            mobile: {
                type: Sequelize.STRING(15),
                allowNull: true,
                defaultValue: null
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: true,
                defaultValue: null
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
