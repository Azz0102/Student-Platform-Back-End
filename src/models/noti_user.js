const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class NotiUser extends Model {
        static associate(models) {}
    }

    NotiUser.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // Assuming 'users' table exists
                    key: "id",
                },
            },
            notiId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "notification",
                    key: "id",
                },
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "NotiUser",
            tableName: "noti_user",
            timestamps: true,
            indexes: [
                { unique: true, fields: ["userId", "notiId"] }, // Unique index to prevent duplicates
            ],
        }
    );

    return NotiUser;
};
