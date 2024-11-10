const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.News, {
                foreignKey: "noti_sender_id",
                as: "newsSender",
            });
            Notification.hasMany(models.NotiUser, { foreignKey: "notiId" });
        }
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
                    isIn: [["EXAM-001", "EVENT-002", "ASSIGNMENT-003"]], // Possible values
                },
                comment: "Possible values: NEWS-001, CLASS-001",
            },
            noti_sender_id: {
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
