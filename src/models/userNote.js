const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class UserNote extends Model {
        static associate(models) {
            UserNote.belongsToMany(models.Tag, {
                through: "NoteTag",
                foreignKey: "noteId",
                otherKey: "tagId",
            });

            UserNote.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }

    UserNote.init(
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
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "UserNote",
            tableName: "user_notes",
            timestamps: true,
        }
    );

    return UserNote;
};
