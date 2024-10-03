"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Permission extends Model {
        // Define any associations if needed
        static associate(models) {
            // For example, if permissions are associated with roles:
            // Permission.belongsToMany(models.Role, { through: 'RolePermission' });
            Permission.belongsToMany(models.Role, {
                through: "role_permission",
                foreignKey: "permissionId",
                otherKey: "roleId",
            });
        }
    }

    Permission.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(75),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT, // Using TEXT instead of TINYTEXT for simplicity in Sequelize
                allowNull: true,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "Permission",
            tableName: "permissions",
            timestamps: true,
            underscored: true,
        }
    );

    return Permission;
};
