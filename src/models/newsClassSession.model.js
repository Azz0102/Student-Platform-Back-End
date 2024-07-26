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
            },
            classSessionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "class_sessions",
                    key: "id",
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "NewsClassSession",
            tableName: "news_class_sessions",
            indexes: [
                {
                    unique: true,
                    fields: ["newsId", "classSessionId"],
                },
            ],
            timestamps: true,
        }
    );

    return NewsClassSession;
};
