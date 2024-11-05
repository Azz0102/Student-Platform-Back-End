"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class RolePermission extends Model {
        static associate(models) {
            // Define associations here if needed
            RolePermission.belongsTo(models.Role, { foreignKey: "roleId" });
            RolePermission.belongsTo(models.Permission, {
                foreignKey: "permissionId",
            });
            RolePermission.belongsTo(models.Resource, {
                foreignKey: "resourceId",
            });
        }
    }

    RolePermission.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "roles",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            permissionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "permissions",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            resourceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "resources",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            attributes: {
                type: DataTypes.STRING(100),
                allowNull: false,
                defaultValue: "*",
            },
        },
        {
            sequelize,
            modelName: "RolePermission",
            tableName: "role_permission",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    fields: ["roleId"],
                    name: "idx_rp_role",
                },
                {
                    fields: ["permissionId"],
                    name: "idx_rp_permission",
                },
            ],
        }
    );

    return RolePermission;
};
