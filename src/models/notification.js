const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Notification extends Model {
        static associate(models) {}
    }

    Notification.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            noti_type: {
                type: DataTypes.STRING(20),
                allowNull: false,
                validate: {
                    isIn: [["NEWS-001", "TIME-001"]], // Possible values
                },
                comment: "Possible values: NEWS-001, TIME-001",
            },
            noti_senderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: "0 is time noti",
                references: {
                    model: "news", // Assuming 'news' table exists
                    key: "id",
                },
            },
            noti_content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            noti_options: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "Notification",
            tableName: "notification",
            timestamps: true, // to automatically handle createdAt and updatedAt
            indexes: [{ fields: ["noti_type"] }, { fields: ["noti_senderId"] }],
        }
    );

    return Notification;
};
