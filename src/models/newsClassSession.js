const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class NewsClassSession extends Model {
        static associate(models) {}
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
