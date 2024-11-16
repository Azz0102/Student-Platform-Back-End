"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsToMany(models.ClassSession, {
                through: models.Enrollment,
            });
            User.hasMany(models.Enrollment);
            // Define associations here if needed
            User.belongsTo(models.Role, { foreignKey: "roleId" });
            User.hasMany(models.NotiUser, { foreignKey: "userId" });
            User.hasMany(models.News, { foreignKey: "userId" });

            User.hasMany(models.Grade, { foreignKey: "userId" });
            User.belongsToMany(models.Channel, {
                through: models.ChannelUser,
                foreignKey: "userId",
                otherKey: "channelId",
            });
            User.hasMany(models.ChannelUser);
            User.hasMany(models.KeyStore, {
                foreignKey: "userId",
            });

            User.hasMany(models.File, { foreignKey: "userId" });

            User.hasMany(models.UserSessionDetails);
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
                // field: "roleId",
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: true,
                // field: "name",
            },
            passwordHash: {
                type: DataTypes.STRING(60),
                allowNull: false,
                // field: "passwordHash",
            },
            lastLogin: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
                // field: "lastLogin",
            },
            reset_token: {
                type: DataTypes.STRING(100),
                allowNull: true, // Có thể null nếu không sử dụng reset mật khẩu
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            timestamps: true, // Sử dụng `createdAt` và `updatedAt` tự động
            // underscored: true, // Chuyển đổi tên trường sang snake_case
        }
    );

    return User;
};
