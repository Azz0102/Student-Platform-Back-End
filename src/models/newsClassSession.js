const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class NewsClassSession extends Model {
        static associate(models) {
            NewsClassSession.belongsTo(models.News, {
                foreignKey: 'newsId',
                as: 'news', // Tên alias để truy cập
            });
            NewsClassSession.belongsTo(models.ClassSession, {
                foreignKey: 'classSessionId',
                as: 'classSession', // Tên alias để truy cập
            });
        }
    }

    NewsClassSession.init(
        {
            newsId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "news",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            classSessionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "class_sessions",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            modelName: "NewsClassSession",
            tableName: "news_class_sessions",
            timestamps: true,
        }
    );

    return NewsClassSession;
};
