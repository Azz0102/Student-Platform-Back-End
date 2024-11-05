"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("role_permission", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false,
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "roles",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            permissionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "permissions",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            resourceId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "resources",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            attributes: {
                type: Sequelize.STRING(100),
                allowNull: false,
                defaultValue: "*",
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

        await queryInterface.addIndex("role_permission", ["roleId"], {
            name: "idx_rp_role",
        });
        await queryInterface.addIndex("role_permission", ["permissionId"], {
            name: "idx_rp_permission",
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("role_permission");
    },
};
