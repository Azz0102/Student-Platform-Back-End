const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class News extends Model {
        static associate(models) {
            News.hasMany(models.NewsClassSession, {
                foreignKey: "newsId",
                onDelete: "CASCADE",
            });

            News.belongsTo(models.User, { foreignKey: "userId" });

            News.hasMany(models.Notification, {
                foreignKey: "noti_senderId",
                as: "notifications",
            });
            News.belongsToMany(models.ClassSession, {
                through: models.NewsClassSession,
                foreignKey: "newsId",
                otherKey: "classSessionId", // Chỉ định khóa khác từ bảng trung gian nếu cần
                as: "ClassSessions", // Đặt alias cho quan hệ
            });

            News.hasMany(models.NewsFile, {
                foreignKey: "newsId",
                onDelete: "CASCADE",
            });
        }
    }

    News.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: "Content is in HTML format",
            },
            isGeneralSchoolNews: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            time: {
                // Trường mới: thời gian
                type: DataTypes.DATE,
                allowNull: true, // Có thể cho phép null
            },
            location: {
                // Trường mới: địa điểm
                type: DataTypes.TEXT,
                allowNull: true, // Có thể cho phép null
            },
            type: {
                type: DataTypes.ENUM("EXAM-001", "EVENT-002", "ASSIGNMENT-003"),
                allowNull: false,
                defaultValue: "EVENT-002",
            },
        },
        {
            sequelize,
            modelName: "News",
            tableName: "news",
            timestamps: true,
        }
    );

    return News;
};
