"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");
module.exports = (sequelize) => {
    class KeyStore extends Model {
        static associate(models) {
            // Define associations here if needed
            // KeyStore.belongsTo(models.Role, { foreignKey: "roleId" });
        }
    }

    KeyStore.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // Tên bảng role trong cơ sở dữ liệu
                    key: "id",
                },
                field: "userId",
            },
            publicKey: {
                type: DataTypes.TEXT,
                allowNull: false,
                field: "publicKey",
            },
            privateKey: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: privateKey,
            },
            refreshToken: {
                type: DataTypes.TEXT,
                allowNull: false,
                field: "refreshToken",
            }
        },
        {
            sequelize,
            modelName: "KeyStore",
            tableName: "KeyStores",
            timestamps: true, // Sử dụng `createdAt` và `updatedAt` tự động
            underscored: true, // Chuyển đổi tên trường sang snake_case
        }
    );

    return KeyStore;
};
