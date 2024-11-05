const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class File extends Model {
        static associate(models) {
            File.belongsTo(models.User, { foreignKey: "userId" });
            File.hasMany(models.NewsFile, { foreignKey: "fileId" });
        }
    }

    File.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // Tên bảng role trong cơ sở dữ liệu
                    key: "id",
                },
                // field: "userId",
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "File",
            tableName: "files",
            timestamps: true,
        }
    );

    return File;
};
