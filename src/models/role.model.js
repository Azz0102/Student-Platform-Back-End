"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Role extends Model {
        static associate(models) {
            // Define associations here if needed
            Role.hasMany(models.User, { foreignKey: "roleId" });
            Role.belongsToMany(models.Permission, {
                through: "role_permission",
                foreignKey: "roleId",
                otherKey: "permissionId",
            });
        }
    }

    Role.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
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
                type: DataTypes.TEXT, // Use TEXT type for descriptions
                allowNull: true,
                defaultValue: null,
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "Role",
            tableName: "roles",
            timestamps: true,
            underscored: true,
        }
    );

    return Role;
};
