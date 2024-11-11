const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class NoteTag extends Model {
        static associate(models) {
            NoteTag.belongsTo(models.Tag, { foreignKey: "tagId" });
            NoteTag.belongsTo(models.UserNote, { foreignKey: "noteId" });
        }
    }

    NoteTag.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            noteId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user_notes",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            tagId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "tags",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        },
        {
            sequelize,
            modelName: "NoteTag",
            tableName: "note_tags",
            timestamps: true, // No need for timestamps in a junction table
        }
    );

    return NoteTag;
};
