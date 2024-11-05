const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class News extends Model {
        static associate(models) {
            News.hasMany(models.NewsClassSession, {
                foreignKey: "newsId",
                onDelete: "CASCADE",
            });

            News.belongsTo(models.User, { foreignKey: "userId", as: "Author" });

            News.hasMany(models.Notification, {
                foreignKey: "noti_senderId",
                as: "notifications",
            });
            News.belongsToMany(models.ClassSession, {
                through: models.NewsClassSession,
                foreignKey: 'newsId',
                otherKey: 'classSessionId', // Chỉ định khóa khác từ bảng trung gian nếu cần
                as: 'ClassSessions' // Đặt alias cho quan hệ
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
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: "Content is in Markdown format",
            },
            isGeneralSchoolNews: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            time: { // Trường mới: thời gian
                type: DataTypes.DATE,
                allowNull: true, // Có thể cho phép null
            },
            location: { // Trường mới: địa điểm
                type: DataTypes.STRING(255),
                allowNull: true, // Có thể cho phép null
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
