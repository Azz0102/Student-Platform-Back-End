"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class KeyStore extends Model {
        static associate(models) {
            // Define associations here if needed
            KeyStore.belongsTo(models.User, { foreignKey: "userId" });
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
                // field: "userId",
            },
            publicKey: {
                type: DataTypes.TEXT,
                allowNull: false,
                // field: "publicKey",
            },
            privateKey: {
                type: DataTypes.TEXT,
                allowNull: false,
                // field: "privateKey",
            },
            refreshToken: {
                type: DataTypes.TEXT,
                allowNull: false,
                // field: "refreshToken",
            },
            device: {
                type: DataTypes.ENUM("web", "mobile"),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "KeyStore",
            tableName: "keystores",
            timestamps: true, // Sử dụng `createdAt` và `updatedAt` tự động
            // underscored: true, // Chuyển đổi tên trường sang snake_case
        }
    );

    return KeyStore;
};
