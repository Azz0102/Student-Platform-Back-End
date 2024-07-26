const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class NewsSubject extends Model {
        static associate(models) {}
    }

    NewsSubject.init(
        {
            newsId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "news",
                    key: "id",
                },
            },
            subjectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "subjects",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            modelName: "NewsSubject",
            tableName: "news_subjects",
            indexes: [
                {
                    unique: true,
                    fields: ["newsId", "subjectId"],
                },
            ],
            timestamps: true,
        }
    );

    return NewsSubject;
};
