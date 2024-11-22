'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_session_details', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            enrollmentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'enrollments',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            sessionDetailsId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'session_details',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            }
        });

        await queryInterface.addIndex('user_session_details', ['enrollmentId', 'sessionDetailsId'], {
            unique: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('user_session_details');
    }
};
