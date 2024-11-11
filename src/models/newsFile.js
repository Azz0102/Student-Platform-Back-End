const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class NewsFile extends Model {
        static associate(models) {
            NewsFile.belongsTo(models.News, { foreignKey: "newsId" });
            NewsFile.belongsTo(models.File, { foreignKey: "fileId" });
        }
    }

    NewsFile.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            newsId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "news",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            fileId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "files",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        },
        {
            sequelize,
            modelName: "NewsFile",
            tableName: "news_file",
            timestamps: true, // No need for timestamps in a junction table
        }
    );

    return NewsFile;
};
