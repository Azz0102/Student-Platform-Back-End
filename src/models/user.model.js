"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");
module.exports = (sequelize) => {
    class User extends Model {
        static associate(models) {
            // Define associations here if needed
            User.belongsTo(models.Role, { foreignKey: "roleId" });
        }
    }

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false,
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "roles", // Tên bảng role trong cơ sở dữ liệu
                    key: "id",
                },
                field: "roleId",
            },
            userName: {
                type: DataTypes.STRING(150),
                allowNull: true,
                field: "userName",
            },
            mobile: {
                type: DataTypes.STRING(15),
                allowNull: true,
                defaultValue: null,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue: null,
            },
            passwordHash: {
                type: DataTypes.STRING(60),
                allowNull: false,
                field: "passwordHash",
            },
            lastLogin: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
                field: "lastLogin",
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            timestamps: true, // Sử dụng `createdAt` và `updatedAt` tự động
            underscored: true, // Chuyển đổi tên trường sang snake_case
        }
    );

    return User;
};
