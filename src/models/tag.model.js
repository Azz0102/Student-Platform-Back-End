const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Tag extends Model {
        static associate(models) {
            Tag.belongsToMany(models.UserNote, {
                through: "NoteTag",
                foreignKey: "tagId",
                otherKey: "noteId",
            });
        }
    }

    Tag.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // Name of the users table
                    key: "id",
                },
            },
            isPermanent: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "Tag",
            tableName: "tags",
            timestamps: true,
        }
    );

    return Tag;
};
